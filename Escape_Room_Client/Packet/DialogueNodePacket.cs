using Escape_Room_Client.Services;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;

namespace Escape_Room_Client.Packet
{
    public class DialogueNodePacket
    {
        public ClientSocket Sockets { get; set; }
        public List<DialogueNodePacket> Children { get; set; }

        public DialogueOptionpacket Option { get; set; }

        internal void Interact()
        {
            Console.WriteLine(Option.nextDialogueText);
            int num = 1;
            foreach (DialogueNodePacket child in Children)
            {
                Console.WriteLine(num.ToString() + ". " + child.Option.OptionText);
            }
            PickOption();
        }

        internal void PickOption()
        {
            Console.WriteLine("Choose an object to investigate");
            int choice = Choose();
            if (choice < Children.Count)
            {
                if (Children[choice].Option.FunctionID != null) 
                {
                    Sockets.Send(Children[choice].Option.FunctionID);
                }
                Children[choice].Interact();
            }
            else
            {
                Console.WriteLine("There aren't that many options. Try again");
                PickOption();
            }
        }

        public int Choose()
        {
            int res;
            Console.WriteLine("Choose an object to investigate");
            var choice = Console.ReadLine();
            bool result = int.TryParse(choice, out res);
            while (!result)
            {
                Console.WriteLine("Couldnt read input, please choose an object to investigate");
                choice = Console.ReadLine();
                result = int.TryParse(choice, out res);
            }
            return res - 1;
        }
    }
}