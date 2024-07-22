import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({code, setCode}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Highlight line 3 after the editor has mounted
    highlightLine(3);

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });
  };

  // Function to highlight a specific line
  const highlightLine = (lineNumber: number) => {
    if (editorRef.current) {
      const newDecorations = editorRef.current.deltaDecorations(
        decorations,
        [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'line-decoration',
            },
          },
        ]
      );
      setDecorations(newDecorations);
    }
  };

  // Use the inline styles directly
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .line-decoration {
        background: yellow;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
    <div>
    <Editor
      height="90vh"
      language="c"
      theme="vs-dark"
      value={code}
      onMount={handleEditorDidMount}
    />

    </div>

    </>
    
  );
};

export default CodeEditor;