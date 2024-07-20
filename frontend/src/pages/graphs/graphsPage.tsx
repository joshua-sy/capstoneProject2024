import React, { useState } from 'react';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import submitCodeFetch from '../../api'

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
  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);

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
    
    const renderComponent = () => {
        switch (currentOutput) {
            case 'Graph':
                return <DotGraphViewer dotGraphString={callGraph}/>;
            case 'Terminal Output':
                return <TerminalOutput />;
            case 'CodeGPT':
                return <CodeGPT />;
            case 'LLVMIR':
                return <LLVMIR />;
            default:
                return <DotGraphViewer dotGraphString={callGraph}/>;
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
          <CodeEditor code={code} setCode={setCode}/>
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
