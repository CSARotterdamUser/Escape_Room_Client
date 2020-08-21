using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IGameObject : IInteractable, IExaminable
    {
        public int ID { get; set; }

        public string Description { get; set; }

        public void OnSelect();
    }
}
