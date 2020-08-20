using System;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IInteraction
    {
        public IMaybe<Action> Callback { get; set; }

        public DialogueData Data { get; set; }


    }
}