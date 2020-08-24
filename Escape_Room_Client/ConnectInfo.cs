using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client
{
    public class ConnectInfo
    {
        public int SocketID { get; set; }

        public ConnectInfo(int socketID)
        {
            SocketID = socketID;
        }

        public ConnectInfo() { }
    }
}
