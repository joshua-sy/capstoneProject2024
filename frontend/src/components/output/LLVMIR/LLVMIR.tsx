import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { llvmIRLanguage } from './llvmIRLanguage';
import { llvmHighlight } from './llvmIRIdentifier';

interface LLVMIRProps {
  LLVMIRString: string;
  llvmFontSize: number;
  code: string;
  lineNumDetails: { [codeLineNum: string]: { nodeOrllvm: string[], colour: string } };
  setLineNumDetails: (newLineNumDetails: { [codeLineNum: string]: { nodeOrllvm: string[], colour: string } }) => void;
}

interface lineNumDetails {
  [codeLineNum: string]: {
    nodeOrllvm: string[],
    colour: string
  }
}

const LLVMIR: React.FC<LLVMIRProps> = ({LLVMIRString, llvmFontSize, code, lineNumDetails, setLineNumDetails}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [decorationCollection, setDecorationsCollection] = useState<monaco.editor.IEditorDecorationsCollection | null>(null);
  const decorationsRef = useRef(null);
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });
    monaco.languages.register({ id: 'llvm-ir' });
    monaco.languages.setMonarchTokensProvider('llvm-ir', llvmIRLanguage);
    decorationsRef.current = editor.createDecorationsCollection();
    setDecorationsCollection(editor.createDecorationsCollection());

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
    });
  };

  useEffect(() => {
    console.log(LLVMIRString);
    console.log(code);
    const codeBylines = code.split('\n');
    console.log(codeBylines);
    const highlightDetails = llvmHighlight(codeBylines, LLVMIRString.split('\n'));
    console.log(highlightDetails);
    highlightLineNum(highlightDetails);
    setLineNumDetails(highlightDetails);
  }, [LLVMIRString]);

  // Sets highlight colours for the lines
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .line-decoration-d9f0e9 { background: #d9f0e9; }
      .line-decoration-ffffe3 { background: #ffffe3; }
      .line-decoration-e9e8f1 { background: #e9e8f1; }
      .line-decoration-ffd6d2 { background: #ffd6d2; }
      .line-decoration-d4e5ee { background: #d4e5ee; }
      .line-decoration-d5e4ef { background: #d5e4ef; }
      .line-decoration-ffe5c9 { background: #ffe5c9; }
      .line-decoration-e5f4cd { background: #e5f4cd; }
      .line-decoration-f2f2f0 { background: #f2f2f0; }
      .line-decoration-e9d6e7 { background: #e9d6e7; }
      .line-decoration-edf8ea { background: #edf8ea; }
      .line-decoration-fff8cf { background: #fff8cf; }
      .text-color { color: red; }
      .line-decoration-text-d9f0e9 { background: #d9f0e9; color: red !important; }
      .line-decoration-text-ffffe3 { background: #ffffe3; color: red !important; }
      .line-decoration-text-e9e8f1 { background: #e9e8f1; color: red !important; }
      .line-decoration-text-ffd6d2 { background: #ffd6d2; color: red !important; }
      .line-decoration-text-d4e5ee { background: #d4e5ee; color: red !important; }
      .line-decoration-text-d5e4ef { background: #d5e4ef; color: red !important; }
      .line-decoration-text-ffe5c9 { background: #ffe5c9; color: red !important; }
      .line-decoration-text-e5f4cd { background: #e5f4cd; color: red !important; }
      .line-decoration-text-f2f2f0 { background: #f2f2f0; color: red !important; }
      .line-decoration-text-e9d6e7 { background: #e9d6e7; color: red !important;}
      .line-decoration-text-edf8ea { background: #edf8ea; color: red !important;}
      .line-decoration-text-fff8cf { background: #fff8cf; color: red !important;}
    `;
    document.head.appendChild(style);
  }, []);

  const highlightLineNum = (lineNumDetails: lineNumDetails) => {
    console.log('highlightLineNum');
    console.log(lineNumDetails);
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const newDecorations = [];

      for (const lineNum in lineNumDetails) {
        console.log('lineNum ', lineNum);
        for (let i = 0; i < lineNumDetails[lineNum]['nodeOrllvm'].length; i++) {
          console.log('llvmLinenum ', lineNumDetails[lineNum]['nodeOrllvm'][i]);
          const llvmLineNum = lineNumDetails[lineNum]['nodeOrllvm'][i];
          const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
          const decoration = {
            range: new monaco.Range(parseInt(llvmLineNum), 1, parseInt(llvmLineNum), 1),
              options: {
                isWholeLine: true,
                inlineClassName: `line-decoration-${colour}`,
              },
          };
          newDecorations.push(decoration);
        }        
      }
      // oldLineHighlights.add(parseInt(lineNum));
      console.log('decorations', newDecorations);

      decorationsRef.current.set(newDecorations);
    }
  }
    
    
  

  

 
  return (
    <>
    <div>
    <Editor
      height="90vh"
      language='llvm-ir'
      theme="vs-light"
      value={LLVMIRString}
      onMount={handleEditorDidMount}
      options={{ fontSize: llvmFontSize }}
    />
    </div>
    </>
    
  );
};

export default LLVMIR;