using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Escape_Room_Client
{
    class ServiceResponse<T>
    {
        public T Outcome { get; set; }

        public bool Successful { get; set; }

        public string Message { get; set; }
        public object ActionType { get; set; }
        public HttpStatusCode Status { get; set; }
    }
}
