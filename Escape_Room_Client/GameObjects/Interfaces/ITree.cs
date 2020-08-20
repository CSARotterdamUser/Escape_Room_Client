using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Interfaces
{
    interface ITree<T>
    {
        public ITreeNode<T> Root { get; set; }

        public void Add(ITreeNode<T> node, T data);

        public void Traverse();
    }
}
