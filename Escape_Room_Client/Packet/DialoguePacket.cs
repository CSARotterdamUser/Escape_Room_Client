using System;

namespace Escape_Room_Client.Packet
{
    public class DialoguePacket
    {
        public DialogueNodePacket Root { get; set; }

        internal void Interact()
        {
            Root.Interact();
        }
    }
}