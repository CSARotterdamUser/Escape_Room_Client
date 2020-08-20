using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IRoom : IGameObject 
    {
        public List<IGameObject> POIs  { get; set; }

        public List<IGameObject> Items { get; set; }

        public List<ITraversable> Traversables { get; set; }


    }
}
