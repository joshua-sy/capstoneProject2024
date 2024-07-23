import React, { useState } from 'react';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import submitCodeFetch from '../../api.ts'
import { LineHighlightProvider } from '../../LineHighlightContext.tsx';


type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

const compileOptions = [
  { value: '-g', label: '-g' },
  { value: '-c', label: '-c' },
  { value: '-S', label: '-S' },
  { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
  { value: '-emit-llvm', label: '-emit-llvm' },
  { value: '-pass-exit-codes', label: '-pass-exit-codes' },
  { value: '-E', label: '-E' },
  { value: '-v', label: '-v' },
  { value: '-pipe', label: '-pipe' },
  { value: '--help', label: '--help' },
  { value: '-fcanon-prefix-map', label: '-fcanon-prefix-map' },
]

function GraphsPage() {
  const inlineStyles = {
    container: {
      display: 'flex',
      // justifyContent: 'space-between',      
    },
  };
  const callGraph = `digraph "Call Graph" {
    label="Call Graph";
  
    Node0x55fc43c981a0 [shape=record,shape=Mrecord,label="{CallGraphNode ID: 1 \\{fun: printf\\}}"];
    Node0x55fc43c98620 [shape=record,shape=box,label="{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}"];
    Node0x55fc43c98620:s0 -> Node0x55fc43c981a0[color=black];
  }`;


  const icfgGraph = ` digraph "ICFG" {
	  label="ICFG";
    Node0x61d549e31a70 [shape=record,color=green,label="{NodeID: 9\\nFunExitBlockNode ID: 9 Exit(\\{  \\})\\n \\{fun: main\\}}"];
    Node0x61d549e31800 [shape=record,color=blue,label="{NodeID: 8\\nRetBlockNode ID: 8   %call = call i32 (i8*, ...) @printf(i8* noundef %0), !dbg !15 \\{ ln: 4  cl: 4  fl: example.c \\} \\{fun: main\\}}"];
    Node0x61d549e31800 -> Node0x61d549e31740[style=solid];
    Node0x61d549e31740 [shape=record,color=black,label="{NodeID: 7\\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \\{ ln: 5  cl: 4  fl: example.c \\}    \\{fun: main\\}}"];
    Node0x61d549e31740 -> Node0x61d549e31a70[style=solid];
    Node0x61d549e31610 [shape=record,color=yellow,label="{NodeID: 6\\nFunEntryBlockNode ID: 6 Entry()\\n \\{fun: printf\\}}"];
    Node0x61d549e1f7f0 [shape=record,color=red,label="{NodeID: 5\\nCallBlockNode ID: 5   %call = call i32 (i8*, ...) @printf(i8* noundef %0), !dbg !15 \\{ ln: 4  cl: 4  fl: example.c \\} \\{fun: main\\}|{|<s1>0x61d549e1f110}}"];
    Node0x61d549e1f7f0 -> Node0x61d549e31800[style=solid];
    Node0x61d549e1f7f0:s1 -> Node0x61d549e31610[style=solid,color=red];
    Node0x61d549e31480 [shape=record,color=black,label="{NodeID: 4\\nIntraBlockNode ID: 4   NormalGepPE: [13\\<--4]  \\n   %0 = getelementptr [14 x i8], [14 x i8]* @.str, i64 0, i64 0 \\{  \\} \\{fun: main\\}}"];
    Node0x61d549e31480 -> Node0x61d549e1f7f0[style=solid];
    Node0x61d549e31360 [shape=record,color=black,label="{NodeID: 3\\nIntraBlockNode ID: 3      store i32 0, i32* %retval, align 4 \\{  \\}    \\{fun: main\\}}"];
    Node0x61d549e31360 -> Node0x61d549e31480[style=solid];
    Node0x61d549e310f0 [shape=record,color=black,label="{NodeID: 2\\nIntraBlockNode ID: 2   AddrPE: [9\\<--10]  \\n   %retval = alloca i32, align 4 \\{  \\} \\{fun: main\\}}"];
    Node0x61d549e310f0 -> Node0x61d549e31360[style=solid];
    Node0x61d549e30f90 [shape=record,color=yellow,label="{NodeID: 1\\nFunEntryBlockNode ID: 1 Entry(\\{ in line: 2 file: example.c \\})\\n \\{fun: main\\}}"];
    Node0x61d549e30f90 -> Node0x61d549e18f20[style=solid];
    Node0x61d549e30f90 -> Node0x61d549e310f0[style=solid];
    Node0x61d549e18f20 [shape=record,color=purple,label="{NodeID: 0\\nCopyPE: [2\\<--3]  \\n i8* null \\{ constant data \\}AddrPE: [4\\<--1]  \\n @.str = private unnamed_addr constant [14 x i8] c\\"Hello, World!\\00\\", align 1 \\{ Glob  \\}AddrPE: [4\\<--1]  \\n @.str = private unnamed_addr constant [14 x i8] c\\"Hello, World!\\00\\", align 1 \\{ Glob  \\}AddrPE: [6\\<--7]  \\n main \\{ in line: 2 file: example.c \\}AddrPE: [15\\<--16]  \\n printf \\{  \\}}"];
}  
`


  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);

  // const readFile = async () => {
  //   const response = await fetch('/icfg.dot');
  //   if (!response.ok) {
  //     console.error('Failed to fetch the file:', response.statusText);
  //     return '';
  //   }
  
  //   const text = await response.text();
  //   console.log('Contents of icfg.dot:', text);
  //   return text;
  // };
  // const graph: string = await readFile();
  const [code, setCode] = useState(
    ` void swap(char **p, char **q) {
        char* t = *p; 
        *p = *q; 
        *q = t;
        }

      int main() {
        char a1, b1; 
        char *a = &a1;
        char *b = &b1;
        swap(&a,&b);
      }`
    );

    // const lineNumToHighlight: number[] = [];
    const [lineNumToHighlight, setlineNumToHighlight] = useState<number[]>([]);


    
    const renderComponent = () => {
        switch (currentOutput) {
            case 'Graph':
                return ( 
                  <LineHighlightProvider>
                    <DotGraphViewer dotGraphString={icfgGraph} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight}/>;
                  </LineHighlightProvider>
                  )
            case 'Terminal Output':
                return <TerminalOutput />;
            case 'CodeGPT':
                return <CodeGPT />;
            case 'LLVMIR':
                return <LLVMIR />;
            // default:
            //     return <DotGraphViewer dotGraphString={icfgGraph} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight}/>;
        }
    };

    const submitCode = () => {
      const selectedCompileOptionString = selectedCompileOptions.map(option => option.value).join(' ');
      submitCodeFetch(code, selectedCompileOptionString);
    }

    const resetDefault = () => {
      setSelectedCompileOptions([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
    }

  return (
    <>
      <div>GraphPage will edit later</div>
      <div style={inlineStyles.container}>
        <div style={{width:'50%'}}>
          <SubmitCodeBar submitEvent={submitCode} resetCompileOptions={resetDefault} compileOptions={compileOptions} selectedCompileOptions={selectedCompileOptions} setSelectedCompileOptions={setSelectedCompileOptions}/>
          <LineHighlightProvider>
            <CodeEditor code={code} setCode={setCode} />
          </LineHighlightProvider>
    </div>
        <div style={{width:'50%'}}>
          <OutputMenuBar setCurrentOutput={setCurrentOutput}/>
          <div>
            {renderComponent()}
          </div>
          {/* <DotGraphViewer /> */}
        </div>
      </div>

    </>
  )
}

export default GraphsPage

