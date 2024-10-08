using System;
using System.Collections.Generic;

namespace api.models
{
    public class SvfResult
    {
        public string Name { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;
        public List<DotGraph> Graphs { get; set; } = [];
        public string Error { get; set; } = string.Empty;
        public string Llvm { get; set; } = string.Empty;
    }

}