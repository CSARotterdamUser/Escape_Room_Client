using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface IInteraction
    {
        public IMaybe<Dialog> Next();
    }
}