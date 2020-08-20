using Escape_Room_Client.GameObjects;
using Escape_Room_Client.GameObjects.Interaction;
using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;

namespace Escape_Room_Client
{
    class Program
    {
        static void Main(string[] args)
        {
            var Room1 = new Room();
            var chair = new Stoel("Kamer1Stoel");
            
            Func<Dialog> SchopStoel = () =>
            {
                chair.InteractState++;
                chair.ExamineState++;
                return new Dialog("De stoel ligt omver", new List<IInteraction>());
            };
            Func<Dialog> InteractStoel = () =>
            {
                return new Dialog("Wat wil je met de stoel doen", new List<IInteraction> { new Interaction("Omver schoppen", SchopStoel), new Interaction("Laten staan") });
            };
            var root = new Interaction
                (
                    lambda: InteractStoel
                );
            chair.Interactions.Add(root);
            Func<Dialog> ZetStoelOvereind = () =>
            {
                chair.InteractState--;
                chair.ExamineState--;
                return new Dialog("De stoel Staat weer rechtop", new List<IInteraction>());
            };
            InteractStoel = () =>
            {
                return new Dialog("Wat wil je met de stoel doen", new List<IInteraction> { new Interaction("Overeind zetten", ZetStoelOvereind), new Interaction("Laten Liggen") });
            };
            root = new Interaction
                (
                    lambda: InteractStoel
                );
            chair.Interactions.Add(root);
            chair.ExamineResults.Add("De stoel staat overeind");
            chair.ExamineResults.Add("De stoel ligt omver");
            Room1.POIs.Add(chair);




        }

        
    }
}
