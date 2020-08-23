using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Escape_Room_Game_Server.Services;
using Escape_Room_Game_Server.Services.BaseSocket;

namespace Escape_Room_Game_Server
{
    public class Socket_Sender : BaseSocket
    {
        public string Result { get; set; }

        public Socket_Sender(int socketid, WebSocket socket, TaskCompletionSource<object> complete) : base(socketid, socket, complete) { }

        internal async Task Send(string res)
        {

            var buffer = Encoding.UTF8.GetBytes(res);
            await Socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            

        }

        internal async Task Listen()
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!res.CloseStatus.HasValue)
            {
                res = await Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

        }
    }
}
