using System;
using System.Net;
using System.Runtime.Serialization;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public readonly HttpStatusCode StatusCode;
        public readonly object Errors;
        public RestException(HttpStatusCode statusCode, object errors = null)
        {
            this.Errors = errors;
            this.StatusCode = statusCode;
        }
    }
}