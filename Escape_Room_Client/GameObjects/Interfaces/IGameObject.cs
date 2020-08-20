using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface IGameObject : IInteractable, IExaminable
    {
        public string ID { get; set; }
    }
}
