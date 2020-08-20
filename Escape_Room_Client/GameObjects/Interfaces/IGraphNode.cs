using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IGraphNode<T>
    {
        public string ID { get; set; }

        public List<IGraphNode<T>> NextOptions { get; set; }
        public T Value { get; set; }

        public bool isEndNode();

    }
}
