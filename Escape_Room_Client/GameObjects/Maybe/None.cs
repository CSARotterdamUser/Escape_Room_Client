using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Maybe
{
    class None<T> : IMaybe<T>
    {
        public bool HasValue { get; set; }
        public None() : base()
        {
            HasValue = false;
        }

        public T GetValue()
        {
            throw new NotImplementedException();
        }
    }
}
