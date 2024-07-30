import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface LLVMIRProps {
  LLVMIRString: string;
}

const LLVMIR: React.FC<LLVMIRProps> = ({LLVMIRString}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
    });
  };

  return (
    <>
    <div>
    <Editor
      height="90vh"
      language="plaintext"
      theme="vs-light"
      value={LLVMIRString}
      onMount={handleEditorDidMount}
    />
    </div>
    </>
    
  );
};

export default LLVMIR;