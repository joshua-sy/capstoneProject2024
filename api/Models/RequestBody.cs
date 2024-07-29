using System;
using System.Collections.Generic;

namespace api.models
{
    public class RequestBody
    {
        public string Input { get; set; } = string.Empty;
        public string CompileOptions { get; set; } = string.Empty;
        public List<string> ExtraExecutables { get; set; } = new List<string>();
    }

}