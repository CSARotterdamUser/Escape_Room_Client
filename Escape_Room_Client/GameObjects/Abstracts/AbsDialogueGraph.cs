using Escape_Room_Client.GameObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Escape_Room_Client.GameObjects.Abstracts
{
    public abstract class AbsDialogueGraph : IGraph<IInteraction>
    {
        public IGraphNode<IInteraction> Root { get; set; }

        public AbsDialogueGraph(string RootID, IInteraction data)
        {
            Root = new GraphNode<IInteraction>(RootID, data);
        }

        public IGraph<IInteraction> Add(string NodeID, string ParentID, IInteraction data)
        {
            if (!Add(Root, NodeID, ParentID, data, new List<string>()))
            {
                throw new Exception();
            }
            else 
            {
                return this;
            }
            
        }

        private bool Add(IGraphNode<IInteraction> curr, string NodeID, string ParentID, IInteraction data, List<string> traversed) 
        {
            if (curr.ID == ParentID)
            {
                curr.NextOptions.Add(new GraphNode<IInteraction>(NodeID, data));
                return true;
            }
            else
            {
                traversed.Add(curr.ID);
                foreach (GraphNode<IInteraction> node in curr.NextOptions)
                {
                    if (!traversed.Contains(node.ID)) 
                    {
                        if (Add(node, NodeID, ParentID, data, traversed)) return true;
                    }
                }
                return false;
            }
        }
    }
}
