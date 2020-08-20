using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects.Maybe
{
    public class Some<T> : IMaybe<T>
    {
        private T Value { get; set; }
        public bool HasValue { get; set; }

        public Some(T value) : base()
        {
            Value = value;
            HasValue = true;
        }

        public T GetValue()
        {
            return Value;
        }
    }
}
