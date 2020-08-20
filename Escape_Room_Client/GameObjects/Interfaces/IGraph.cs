using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    public interface IGraph<T>
    {
        public IGraphNode<T> Root { get; set; }

        public IGraph<T> Add(string NodeID, string ParentID, T data);

        
        
    }
}
