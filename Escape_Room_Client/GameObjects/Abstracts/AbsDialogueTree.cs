using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Escape_Room_Client.GameObjects.Abstracts
{
    class AbsDialogueTree : ITree<DialogueData>
    {
        public ITreeNode<DialogueData> Root { get; set; }



        public void Add(DialogueData data, string ID, ITreeNode<DialogueData> parent = null)
        {
            if (parent == null)
            {
                if (Root == null) Root = new TreeNode<DialogueData>(ID, data);
                else throw new Exception();

            }
            else 
            {
                
            }
            Add();
        }

        public ITreeNode<DialogueData> FindNodeByID(string ID)
        {
            if (Root.ID.Equals(ID)) return Root;

            else return FindNodeByID(Root, ID);
        }

        privatebool NodeIsInChildren(ITreeNode<DialogueData> node, string ID)
        {

            return node.Children.Where(el => el.ID == ID).Any();  
        }
    }
}
