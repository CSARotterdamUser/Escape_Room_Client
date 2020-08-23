using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Escape_Room_Game_Client.Services.BaseSocket
{
    public abstract class BaseSocket
    {
        public int SocketId { get; set; }
        public ClientWebSocket Socket { get; set; }

        public TaskCompletionSource<object> Complete { get; set; }

        public BaseSocket(int socketid, ClientWebSocket socket, TaskCompletionSource<object> complete)
        {
            SocketId = socketid;
            Socket = socket;
            Complete = complete;
        }
        public bool IsConnected()
        {
            if (Socket == null) { return false; }
            return Socket.State == WebSocketState.Open;
        }

        public void Close(object res) 
        {
            Complete.TrySetResult(res);
        }



    }
}
