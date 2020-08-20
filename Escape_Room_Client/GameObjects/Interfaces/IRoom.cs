using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface IRoom : IGameObject 
    {
        public List<IInteractable> POIs  { get; set; }

        public List<IInteractable> Items { get; set; }

        public List<ITraversable> Traversables { get; set; }


    }
}
