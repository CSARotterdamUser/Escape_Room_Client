using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public class DialogueData
    {
        public string OptionText { get; set; }
        public string NextDialogue { get; set; }

        public DialogueData(string optiontext, string nextdialogue)
        {
            OptionText = optiontext;
            NextDialogue = nextdialogue;
        }
    }
}
