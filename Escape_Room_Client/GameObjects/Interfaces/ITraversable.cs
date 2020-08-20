namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface ITraversable : IGameObject
    {
        public IRoom Destination { get; set; }

    }
}