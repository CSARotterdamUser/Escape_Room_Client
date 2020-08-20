using Escape_Room_Client.GameObjects.Abstracts;
using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public class Traversable : AbsTraversable
    {
        public Traversable(string id ,string desc, IRoom destination) : base(id, desc, destination)
        {

        }
    }
}
