using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client
{
    public class ConnectInfo
    {
        public int Listener { get; set; }

        public int Sender { get; set; }

        public ConnectInfo(int listener, int sender)
        {
            Listener = listener;
            Sender = sender;
        }

        public ConnectInfo() { }
    }
}
