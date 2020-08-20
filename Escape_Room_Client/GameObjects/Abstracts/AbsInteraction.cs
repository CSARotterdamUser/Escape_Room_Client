using Escape_Room_Client.GameObjects.Interfaces;
using Escape_Room_Client.GameObjects.Maybe;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public abstract class AbsInteraction : IInteraction
    {
        public IMaybe<Action> Callback { get; set; }

        public DialogueData Data { get; set; }

        public AbsInteraction(DialogueData data, Action callback = null)
        {
            Data = data;
            if (callback == null) Callback = new None<Action>();
            else Callback = new Some<Action>(callback);
        }
    }
}
