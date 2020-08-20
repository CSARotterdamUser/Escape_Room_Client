using Escape_Room_Client.GameObjects.Interfaces;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Abstracts
{
    abstract class AbsTraversable : ITraversable
    {
        public string ID { get; set; }
        public int InteractState { get; set; }
        public int ExamineState { get; set; }
        public List<string> ExamineResults { get; set; }

        public IRoom Destination  { get; set; }

        public List<IInteraction> Interactions { get; set; }

        public AbsTraversable(string id, IRoom destination)
        {
            ID = id;
            InteractState = 0;
            ExamineState = 0;
            Destination = destination;
            Interactions = new List<IInteraction>();
            
        }







        
    }
}
