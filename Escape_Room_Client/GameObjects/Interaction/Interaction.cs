using Escape_Room_Client.GameObjects.Interfaces;
using Escape_Room_Client.GameObjects.Maybe;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interaction
{
    class Interaction : AbsInteraction
    {
        public string Text { get; set; }
        public Func<Dialog> Lambda { get; set; }
        public Interaction(string text = "", Func<Dialog> lambda = null)
        {
            Text = text;
            Lambda = lambda;
        }

        public override IMaybe<Dialog> Next()
        {
            if (Lambda == null)
            {
                return new None<Dialog>();
            }
            else 
            {
                return new Some<Dialog>(Lambda());
            }
        }
    }
}
