using System;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Escape_Room_Game_Server.Services;
using System.Net.WebSockets;
using Escape_Room_Game_Client.Services.BaseSocket;

namespace Escape_Room_Game_Client
{
    public class Socket_Listener : BaseSocket
    {
       

        public Socket_Pair Pair { get; set; }
        string _result;
        public string Result
        {
            get { return _result; }
            set { _result = value; if (Pair != null) { Pair.OnListenerUpdateCallback(_result); } }
        }



        public Socket_Listener(int socketid, WebSocket socket, TaskCompletionSource<object> complete) : base(socketid, socket, complete) {  }


        internal async Task Listen()
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            Result = Encoding.UTF8.GetString(Decode(buffer)).Trim();
            Console.WriteLine(Result);
            while (!res.CloseStatus.HasValue)
            {
                buffer = new byte[1024 * 4];
                res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                Result = Encoding.UTF8.GetString(Decode(buffer));
                Console.WriteLine(Result);
            }
            //Complete.TrySetResult(res);
            //await Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Fuck off", CancellationToken.None);
            

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


    }
}
