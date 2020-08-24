using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.Packet
{
    public class RoomPacket
    {
        public int RoomID { get; set; }

        public List<POIPacket> POIs { get; set; }

        public List<ItemPacket> Items { get; set; }

        public void Interact()
        {
            Console.WriteLine("You see the following objects around you");
            int num = 1;
            foreach (var POI in POIs)
            {
                Console.WriteLine(num.ToString() + ". " + POI.Info.Description);
                num++;
            }
            PickPOI();
        }

        public void PickPOI() 
        {
            int choice = Choose();
            if (choice < POIs.Count)
            {
                POIs[choice].Interact();
            }
            else
            {
                choice -= POIs.Count;
                if (choice < Items.Count)
                {
                    Items[choice].Interact();
                }
                else
                {
                    Console.WriteLine("There aren't that many objects to interact with here. Try again");
                    PickPOI();
                }
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
