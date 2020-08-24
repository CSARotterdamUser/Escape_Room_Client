using System;
using System.Net.WebSockets;
using System.Threading;
using Newtonsoft.Json;
using Escape_Room_Client.Packet;
using Escape_Room_Client.Services;
using System.Threading.Tasks;
using System.Text;
using System.Collections.Generic;
using System.Net.Http;

namespace Escape_Room_Client
{
    public static class Program
    {
        public static ClientSocket Socket { get; set; }

        public static RoomPacket CurrentRoom { get; set; }

        private static readonly HttpClient client = new HttpClient();

        static async Task Login()
        {
            string WEBSERVICE_URL = "http://localhost:5002/api/auth/login";
            var login = new UserLogin
            {
                username = "HenkDeTenk",
                password = "password",
            };

            var s = JsonConvert.SerializeObject(login);

            var content = new StringContent(s, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(WEBSERVICE_URL, content);

            var responseString = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseString);
            await MakeSockets(JsonConvert.DeserializeObject<ServiceResponse<string>>(responseString).Outcome);
        }

        static async Task MakeSockets(string token)
        {
            ConnectInfo connect;
            string WEBSERVICE_URL = "http://localhost:5000/api/socket/create";
            try
            {
                var webRequest = System.Net.WebRequest.Create(WEBSERVICE_URL);
                if (webRequest != null)
                {
                    webRequest.Method = "GET";
                    webRequest.Timeout = 12000;
                    webRequest.ContentType = "application/json";
                    webRequest.Headers.Add("Session-Id", token);
                    webRequest.Headers.Add("Group-Id", "4");

                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var jsonResponse = sr.ReadToEnd();
                            Console.WriteLine(jsonResponse);
                            connect = JsonConvert.DeserializeObject<ConnectInfo>(jsonResponse);
                            await Connect(connect, token);
                        }
                    }
                }
            }
            catch
            {

            }
        }

        static async Task Connect(ConnectInfo connect, string token)
        {
            ClientWebSocket sock = new ClientWebSocket();
            await sock.ConnectAsync(new Uri("wss://localhost:5001/socket/" + connect.SocketID.ToString()), CancellationToken.None);
            string res = token;
            var buffer = Encoding.UTF8.GetBytes(res);
            await sock.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);

            Socket = new ClientSocket(sock);
            Socket.Listen();

            StartGame(token);

        }

        static void StartGame(string token)
        {

            string WEBSERVICE_URL = "http://localhost:5000/api/socket/start";
            try
            {
                var webRequest = System.Net.WebRequest.Create(WEBSERVICE_URL);
                if (webRequest != null)
                {
                    webRequest.Method = "GET";
                    webRequest.Timeout = 12000;
                    webRequest.ContentType = "application/json";
                    webRequest.Headers.Add("Session-Id", token);
                    webRequest.Headers.Add("Group-Id", "4");

                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                           
                        }
                    }
                }
            }
            catch
            {

            }
        }
        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(OnProcessExit);
            Login();


            while (Socket == null) ;
            Console.WriteLine("Je wordt wakker in een kamer.)
            while (true)
            {
                if (CurrentRoom != null)
                {
                    Console.WriteLine("Rond je zie je: ");
                    CurrentRoom.Interact();
                }

            }

        }

        static async void OnProcessExit(object sender, EventArgs e)
        {
            if (Socket != null && Socket.Socket != null && (Socket.Socket.State != WebSocketState.Aborted || Socket.Socket.State != WebSocketState.Closed))
            {
                await Socket.Send("Disconnect");
            }
            Console.WriteLine("I'm out of here");
        }
    }
}
