using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    class Dialog
    {
        public string Text { get; set; }

        public List<IInteraction> Options { get; set; }

        public Dialog(string text, List<IInteraction> options)
        {
            Text = text;
            Options = options;
        }
    }
}
