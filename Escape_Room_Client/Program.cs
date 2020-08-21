using Escape_Room_Client.GameObjects;
using Escape_Room_Client.GameObjects.Abstracts;
using Escape_Room_Client.GameObjects.Interaction;
using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.WebSockets;

using System.Threading;
using Newtonsoft.Json;

namespace Escape_Room_Client
{
    class Program
    {
        static void MakeSockets()
        {
            string WEBSERVICE_URL = "http://localhost:5000/api/socket/create";
            try
            {
                var webRequest = System.Net.WebRequest.Create(WEBSERVICE_URL);
                if (webRequest != null)
                {
                    webRequest.Method = "GET";
                    webRequest.Timeout = 12000;
                    webRequest.ContentType = "application/json";
                    webRequest.Headers.Add("Session-Id", "HeyHiThereIAmAToken");
                    webRequest.Headers.Add("Group-Id", "5");

                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var jsonResponse = sr.ReadToEnd();
                            ConnectInfo connect = JsonConvert.DeserializeObject<ConnectInfo>(jsonResponse);
                            Connect(connect);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        static void Connect(ConnectInfo connect) 
        {
            ClientWebSocket listener = new ClientWebSocket();
            listener.ConnectAsync(new Uri("wss://localhost:5001/socket/" + connect.Listener.ToString()), CancellationToken.None);

            ClientWebSocket sender = new ClientWebSocket();
            sender.ConnectAsync(new Uri("wss://localhost:5001/socket/" + connect.Sender.ToString()), CancellationToken.None);
            
        }
        static Player Setup()
        {

            var Room1 = new Room(0, "Een kamer");
            var Room2 = new Room(1, "Een kamer");
            var chair = new Stoel("Kamer1Stoel", "Een stoel");
            var deur = new Traversable("DeurKamer1Naar2", "Een deur", Room2);

            var player = new Player(Room1);

            Action unlockdeur = () => deur.InteractState = chair.InteractState = 1;
            Action lockdeur = () => deur.InteractState = chair.InteractState = 0;

            Action movetoroom2 = () => player.Position = Room2;

            var stoelInteractions = new List<IGraph<IInteraction>>
            {
                new DialogueGraph("StoelRoot", new Interaction(new DialogueData("", "Je ziet een stoel. De stoel staat overeind")))
                .Add("StoelSchop", "StoelRoot" , new Interaction(new DialogueData("Schop de stoel omver", "De stoel valt omver. Je hoort een klik bij de deur."), unlockdeur))
                .Add("StoelWeg", "StoelRoot", new Interaction(new DialogueData("Doe niets, loop weg.", "Je laat de stoel staan"))),

                new DialogueGraph("StoelRoot", new Interaction(new DialogueData("", "Je ziet een stoel. De stoel ligt omver op de grond")))
                .Add("StoelZet", "StoelRoot" , new Interaction(new DialogueData("Zet de stoel overeind", "Je zet de stoel overeind. Je hoort een klik bij de deur."), lockdeur))
                .Add("StoelWeg", "StoelRoot", new Interaction(new DialogueData("Doe niets, loop weg.", "Je laat de stoel liggen"))),

            };

            chair.Interactions = stoelInteractions;

            var deurInteractions = new List<IGraph<IInteraction>>
            {
                new DialogueGraph("DeurRoot", new Interaction(new DialogueData("", "Je probeert de deur open te maken. De deur zit op slot.")))
                .Add("DeurWeg", "DeurRoot", new Interaction(new DialogueData("Loop weg","Je loopt weg van de deur"))),

                new DialogueGraph("DeurRoot", new Interaction(new DialogueData("", "Je probeert de deur open te maken. De deur gaat open.")))
                .Add("DeurTraverse", "DeurRoot", new Interaction(new DialogueData("Ga door de deur",""), movetoroom2))
                .Add("DeurWeg", "DeurRoot", new Interaction(new DialogueData("Loop weg","Je loopt weg van de deur"))),
            };

            deur.Interactions = deurInteractions;

            Room1.POIs.Add(chair);
            Room1.Traversables.Add(deur);

            return player;
        }
        static void Main(string[] args)
        {
            MakeSockets();
            Player player = Setup();
            Console.WriteLine("Je wordt wakker in een kamer. Rond je zie je: \n");

            while (true)
            {
                player.Position.OnSelect();
            }
        }


    }
}
