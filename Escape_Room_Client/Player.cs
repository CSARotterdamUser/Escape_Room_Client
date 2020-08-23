using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client
{
    public class Player
    {
        public IRoom Position;

        public Player(IRoom pos)
        {
            Position = pos;
        }
    }
}
