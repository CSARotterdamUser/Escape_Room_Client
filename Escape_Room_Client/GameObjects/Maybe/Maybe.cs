using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public interface IMaybe<T>
    {
        public bool HasValue { get; set; }

        public T GetValue();
    }
}
