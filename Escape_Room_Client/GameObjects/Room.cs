using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class Room : IRoom
    {
        public List<IInteractable> POIs { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public List<IInteractable> Items { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public List<ITraversable> Traversables { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public string ID { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public int InteractState { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public List<IInteraction> Interactions { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public int ExamineState { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public List<string> ExamineResults { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }
}
