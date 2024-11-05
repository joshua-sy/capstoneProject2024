import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';
import './terminalOutput.css';
interface TerminalOutputProps {
  terminalOutputString: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({terminalOutputString}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);

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
      <div id='terminalOutput-fontSize-container'>
        <FontSizeMenu fontSize={fontSize} setFontSize={setFontSize}/>
      </div>
      <Editor
        height="90vh"
        language="plaintext"
        theme="vs-dark"
        value={terminalOutputString}
        onMount={handleEditorDidMount}
        options={{ fontSize: fontSize }}

      />
    </div>
    </>
    
  );
};

export default TerminalOutput;