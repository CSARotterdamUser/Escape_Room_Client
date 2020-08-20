using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class Stoel : IGameObject
    {
        public string ID { get ; set; }
        public int InteractState { get; set; }
        public List<string> ExamineResults { get; set; }
        public List<IInteraction> Interactions { get; set; }
        public int ExamineState { get; set; }

        public Stoel(string id)
        {
            ID = id;
            InteractState =  0;
            Interactions = new List<IInteraction>();
            ExamineResults = new List<string>();
            
        }
    }
}
