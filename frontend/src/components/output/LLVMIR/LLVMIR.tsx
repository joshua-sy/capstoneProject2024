import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { llvmIRLanguage } from './llvmIRLanguage';

interface LLVMIRProps {
  LLVMIRString: string;
  llvmFontSize: number;

}

const LLVMIR: React.FC<LLVMIRProps> = ({LLVMIRString, llvmFontSize}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });
    monaco.languages.register({ id: 'llvm-ir' });
    monaco.languages.setMonarchTokensProvider('llvm-ir', llvmIRLanguage);

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
    });
  };

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