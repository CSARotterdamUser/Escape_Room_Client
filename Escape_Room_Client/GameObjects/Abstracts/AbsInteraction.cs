using Escape_Room_Client.GameObjects.Interfaces;
using Escape_Room_Client.GameObjects.Maybe;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    abstract class AbsInteraction : IInteraction
    {
        abstract public IMaybe<Dialog> Next();
    }
}
