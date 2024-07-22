import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  lineNumToHighlight: number[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({code, setCode, lineNumToHighlight}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // // Highlight line 3 after the editor has mounted
    // highlightLine(3);

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

  useEffect(() => {
    decorations.forEach(decoration => editorRef.current?.deltaDecorations([decoration], []));
    lineNumToHighlight.forEach(lineNum => {
      highlightLine(lineNum);
    });
  }, [lineNumToHighlight]);

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