import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface TerminalOutputProps {
  terminalOutputString: string;
  terminalOutputFontSize: number;

}

const TerminalOutput: React.FC<TerminalOutputProps> = ({terminalOutputString, terminalOutputFontSize}) => {
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
      value={terminalOutputString}
      onMount={handleEditorDidMount}
      options={{ fontSize: terminalOutputFontSize }}

    />
    </div>
    </>
    
  );
};

export default TerminalOutput;