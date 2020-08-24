using Escape_Room_Client.Packet;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Escape_Room_Client.Services
{
    public class ClientSocket
    {
        public ClientWebSocket Socket { get; set; }

        public string Result { get; set; }

        public ClientSocket(ClientWebSocket socket)
        {
            Socket = socket;

        }

        public bool isConnected() 
        {
            if(Socket == null) { return false; }
            return Socket.State == WebSocketState.Open;
        }

        public void OnListenerUpdateCallback(RoomPacket packet)
        {
            Program.CurrentRoom = packet;
        }

        internal async Task Listen()
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            DeserializeRoomPacket(Encoding.UTF8.GetString(Decode(buffer)).Trim());
            Result = Encoding.UTF8.GetString(Decode(buffer)).Trim();

            Console.WriteLine(Result);
            while (!res.CloseStatus.HasValue)
            {
                buffer = new byte[1024 * 4];
                res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                DeserializeRoomPacket(Encoding.UTF8.GetString(Decode(buffer)).Trim());
                Console.WriteLine(Result);
            }
            //Complete.TrySetResult(res);
            //await Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
        }



        private void DeserializeRoomPacket(string json)
        {
            try
            {
                RoomPacket packet = JsonConvert.DeserializeObject<RoomPacket>(json);
                if (packet != null) 
                {
                    Program.CurrentRoom = packet;
                }
            }
            
            catch { }
        }

        public byte[] Decode(byte[] packet)
        {
            var i = packet.Length - 1;
            while (packet[i] == 0)
            {
                --i;
            }
            var temp = new byte[i + 1];
            Array.Copy(packet, temp, i + 1);
            return temp;
        }

        public async Task Send(string funcID) 
        {
            var buffer = Encoding.UTF8.GetBytes(funcID);
            await Socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }

    }
}
