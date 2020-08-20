using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IInteractable
    {
        public int InteractState { get; set; }

        public List<IGraph<IInteraction>> Interactions { get; set; }

        public void OnInteract();
    }
}
