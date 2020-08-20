using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class GraphNode<T> : IGraphNode<T>
    {
        public string ID { get; set; }
        public List<IGraphNode<T>> NextOptions { get; set; }
        public T Value { get; set; }

        public GraphNode(string id, T value)
        {
            ID = id;
            Value = value;
            NextOptions = new List<IGraphNode<T>>();
        }

        public bool isEndNode() 
        {
            return NextOptions.Count == 0;
        }
    }
}
