using Escape_Room_Client.GameObjects.Abstracts;
using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public class DialogueGraph : AbsDialogueGraph
    {

        public DialogueGraph(string RootID, IInteraction data) : base(RootID, data)
        {

        }
    }
}
