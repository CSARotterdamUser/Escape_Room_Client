﻿using Escape_Room_Client.GameObjects.Interfaces;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Abstracts
{
    public abstract class AbsTraversable : ITraversable
    {
        public string ID { get; set; }
        public string Description { get; set; }
        public int InteractState { get; set; }
        public int ExamineState { get; set; }
        public List<string> ExamineResults { get; set; }

        public IRoom Destination  { get; set; }

        public List<IGraph<IInteraction>> Interactions { get; set; }

        public AbsTraversable(string id, string desc, IRoom destination)
        {
            ID = id;
            Description = desc;
            InteractState = 0;
            ExamineState = 0;
            Destination = destination;
            Interactions = new List<IGraph<IInteraction>>();
            
        }

        public void OnInteract()
        {
            OnInteract((GraphNode<IInteraction>) Interactions[InteractState].Root);
        }

        private void OnInteract(GraphNode<IInteraction> curr) 
        {
            Console.WriteLine(curr.Value.Data.NextDialogue);

            foreach (var option in curr.NextOptions)
            {
                Console.WriteLine(option.Value.Data.OptionText);
            }
            Console.WriteLine("Pick an option");
            int choice = int.Parse(Console.ReadLine()) - 1;

            GraphNode<IInteraction> next = (GraphNode<IInteraction>) curr.NextOptions[choice];

            if (next.Value.Callback.HasValue) 
            {
                next.Value.Callback.GetValue()();
            }
            if (!next.isEndNode())
            {
                OnInteract(next);
            }
            else 
            {
                Console.WriteLine(next.Value.Data.NextDialogue);
            }

        }

        public void OnSelect()
        {
            Console.WriteLine("Kies een actie om uit te voeren\n 1. Interact\n 2. Examine");
            int choice = int.Parse(Console.ReadLine());
            switch (choice)
            {
                case 1:
                    OnInteract();
                    break;
                case 2:
                    OnExamine();
                    break;
                default:
                    break;
            }
        }

        public void OnExamine()
        {
            Console.WriteLine(Description);
        }
    }
}
