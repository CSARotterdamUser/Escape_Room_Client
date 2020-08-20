using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class DialogueData
    {
        public string OptionText { get; set; }
        public IInteraction Interaction { get; set; }
        public string NextDialogue { get; set; }
    }
}
