using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class Room : IRoom
    {
        public List<IGameObject> POIs { get; set; }
        public List<IGameObject> Items { get; set; }
        public List<ITraversable> Traversables { get; set; }
        public int ID { get; set; }
        public string Description { get; set; }
        public int InteractState { get; set; }
        public List<IGraph<IInteraction>> Interactions { get; set; }
        public int ExamineState { get; set; }
        public List<string> ExamineResults { get; set; }

        public Room(int id, string desc)
        {
            ID = id;
            Description = desc;
            InteractState = 0;
            ExamineState = 0;
            POIs = new List<IGameObject>();
            Items = new List<IGameObject>();
            Traversables = new List<ITraversable>();
        }

        public void OnInteract() { }

        public void OnExamine()
        {
            throw new NotImplementedException();
        }

        public void OnSelect()
        {
            Console.WriteLine("Kies een object om mee te interacten.");
            int num = 1;
            foreach (var poi in POIs)
            {
                Console.WriteLine(num.ToString() + ". " + poi.Description);
                num++;
            }
            foreach (var item in Items)
            {
                Console.WriteLine(num.ToString() + ". " + item.Description);
                num++;
            }
            foreach (var door in Traversables)
            {
                Console.WriteLine(num.ToString() + ". " + door.Description);
                num++;
            }
            int choice = int.Parse(Console.ReadLine()) - 1;
            if (choice < POIs.Count) { POIs[choice].OnSelect(); }
            else
            {
                choice -= POIs.Count;
                if (choice < Items.Count)
                {
                    Items[choice].OnSelect();
                }
                else
                {
                    choice -= Items.Count;
                    if (choice < Traversables.Count)
                    {
                        Traversables[choice].OnSelect();
                    }
                    else { OnSelect(); }
                }
            }
        }

        
    }
}
