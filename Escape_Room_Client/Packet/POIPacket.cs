using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.Packet
{
    class POIPacket
    {
        public InfoPacket Info { get; set; }

        public DialoguePacket Dialogue { get; set; }

        internal void Interact()
        {
            Console.WriteLine("Choose an action to perform");
            Console.WriteLine("1. Interact");
            Console.WriteLine("2. Examine");
            PickAction();
        }

        internal void PickAction() 
        {
            var choice = Console.ReadLine();
            switch (choice.ToLower())
            {
                case ("interact"):
                    Dialogue.Interact();
                    break;
                case ("examine"):
                    Console.WriteLine(Info.Examine);
                    break;
                default:
                    break;
            }
        }
    }
}
