using Escape_Room_Client.GameObjects.Interfaces;
using Escape_Room_Client.GameObjects.Maybe;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interaction
{
    public class Interaction : AbsInteraction
    {
        public Interaction(DialogueData data, Action callback = null) : base(data, callback) { }
    }
}
