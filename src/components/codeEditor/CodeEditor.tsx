import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

const CodeEditor: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Highlight line 3 after the editor has mounted
    highlightLine(3);
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
    <div style={{width: '50%'}}>
    <Editor
      height="90vh"
      language="c"
      theme="vs-dark"
      value={`void swap(char **p, char **q) {
              char* t = *p; 
              *p = *q; 
              *q = t;
              }

              int main() {
              char a1, b1; 
              char *a = &a1;
              char *b = &b1;
              swap(&a,&b);
              }`}
      onMount={handleEditorDidMount}
    />

    </div>

    </>
    
  );
};

export default CodeEditor;