using Escape_Room_Client.GameObjects.Interfaces;
using Escape_Room_Game_Client;

namespace Escape_Room_Game_Server.Services
{
    public class Socket_Pair
    {
        public Socket_Listener Listener { get; set; }
        public Socket_Sender Sender { get; set; }

        public Socket_Pair(Socket_Listener listener, Socket_Sender sender)
        {
            Listener = listener;
            Sender = sender;

            Listener.Pair = this;
        }

        public bool isConnected() 
        {
            if(Listener == null || Sender == null) { return false; }
            return Listener.IsConnected() && Sender.IsConnected();
        }

        public async void OnListenerUpdateCallback(IRoom res)
        {
            
        }

    }
}
