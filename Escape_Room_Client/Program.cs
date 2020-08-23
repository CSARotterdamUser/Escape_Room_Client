using Escape_Room_Client.GameObjects;
using Escape_Room_Client.GameObjects.Abstracts;
using Escape_Room_Client.GameObjects.Interaction;
using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.WebSockets;

using System.Threading;
using Newtonsoft.Json;
using System.Text;
using Escape_Room_Game_Server.Services;
using Escape_Room_Client.Packet;

namespace Escape_Room_Client
{
    class Program
    {
        public static Socket_Pair Sockets { get; set; }

        public static RoomPacket CurrentRoom { get; set; }
        static void MakeSockets()
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
                    webRequest.Headers.Add("Session-Id", "HeyHiThereIAmAToken");
                    webRequest.Headers.Add("Group-Id", "5");

                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var jsonResponse = sr.ReadToEnd();
                            connect = JsonConvert.DeserializeObject<ConnectInfo>(jsonResponse);
                            Connect(connect);
                        }
                    }
                }
            }
            catch
            {

            }
        }

        static void Connect(ConnectInfo connect)
        {

            ClientWebSocket listener = new ClientWebSocket();
            listener.ConnectAsync(new Uri("wss://localhost:5001/socket/" + connect.Listener.ToString()), CancellationToken.None);

            ClientWebSocket sender = new ClientWebSocket();
            sender.ConnectAsync(new Uri("wss://localhost:5001/socket/" + connect.Sender.ToString()), CancellationToken.None);
        }
        static async void Main(string[] args)
        {


            Console.WriteLine("Je wordt wakker in een kamer. Rond je zie je: \n");

            while (true)
            {
                CurrentRoom.Interact();
            }
        }
    }
}
