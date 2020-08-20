using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    class TreeNode<T> : ITreeNode<T>
    {
        public string ID { get; set; }
        public ITreeNode<T> Parent { get; set; }
        public List<ITreeNode<T>> Children { get; set; }
        public T Value { get; set; }

        public TreeNode(string id, T value)
        {
            ID = id;
            Value = value;
        }
    }
}
