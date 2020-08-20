using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface IInteractable
    {
        public int InteractState { get; set; }

        public List<IInteraction> Interactions { get; set; }
    }
}
