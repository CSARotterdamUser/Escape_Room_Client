namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface ITraversable : IGameObject
    {
        public IRoom Destination { get; set; }

    }
}