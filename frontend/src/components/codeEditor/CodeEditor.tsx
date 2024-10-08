import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './styles.css';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  lineNumToHighlight: Set<number>;
  lineNumDetails: { [key: string]: { nodeOrllvm: string[], colour: string } };
  setCurrCodeLineNum: (lineNum: number) => void;
  codeFontSize: number;
  codeError : string[];
}

const highlightColours = ['d9f0e9', 'ffffe3', 'e9e8f1', 'ffd6d2', 'd4e5ee', 'd5e4ef', 'ffe5c9', 'e5f4cd', 'f2f2f0', 'e9d6e7', 'edf8ea', 'fff8cf'];


const CodeEditor: React.FC<CodeEditorProps> = ({code, setCode, lineNumToHighlight, lineNumDetails, setCurrCodeLineNum, codeFontSize, codeError}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [oldHighlight, setOldHighlight] = useState<Set<number>>(new Set<number>());
  const [decorationCollection, setDecorationsCollection] = useState<monaco.editor.IEditorDecorationsCollection | null>(null);
  const decorationsRef = useRef(null);


  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection();
    setDecorationsCollection(editor.createDecorationsCollection());
    editor.updateOptions({ 
      fontSize: codeFontSize,
      renderValidationDecorations: 'on',
     });
     monaco.languages.register({ id: 'c' });

    monaco.languages.setLanguageConfiguration('c', {
      // Ensure C language supports diagnostics markers
    });

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });

    // Sets the current line number when the cursor position changes
    editor.onDidChangeCursorPosition((event) => {
      const lineNum = event.position.lineNumber;
      console.log('cursor changed to lineNum', lineNum);
      setCurrCodeLineNum(lineNum);
    });
    const model = editorRef.current.getModel();
    monaco.editor.setModelMarkers(model, 'c', [
    {
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: model.getLineLength(1) + 1,
      message: 'test',
      severity: monaco.MarkerSeverity.Error,
    },
    {
      startLineNumber: 10,
      startColumn: 1,
      endLineNumber: 10,
      endColumn: model.getLineLength(1) + 1,
      message: 'test',
      severity: monaco.MarkerSeverity.Error,
    },
  ]);

  };


  useEffect(() => {
    console.log('useEffect for code error is triggered');
    console.log('errors is ', codeError);
    const applyMarkers = () => {
      monaco.languages.register({ id: 'c' });

      monaco.languages.setLanguageConfiguration('c', {
        // Ensure C language supports diagnostics markers
      });
      if (editorRef.current && codeError.length !== 0 ) {
        const model = editorRef.current.getModel();
        console.log('Model:', editorRef.current.getModel());
        console.log('Model language:', model.getLanguageId());
  
  
        console.log('editorRef is not null');
        const lnRegex = /ln:\s*(\d+)/g;
        const lnJsonRegex = /ln":\s*(\d+)/g;
        const clRegex = /cl:\s*(\d+)/g;
        let markers = []
        codeError.map((error) => {
          let match;
          let lnNum = 0;
          let clNum = 1;
  
          match = error.match(lnRegex);
          if (match) {
            const lineAndNum = match[0].split(' ');
            lnNum = parseInt(lineAndNum[1], 10);
          }
  
          match = error.match(clRegex);
          if (match) {
            const lineAndNum = match[0].split(' ');
            clNum = parseInt(lineAndNum[1], 10);
          }
          if (lnNum !== 0) {
            markers.push({
              startLineNumber: lnNum,
              startColumn: clNum,
              endLineNumber: lnNum,
              endColumn: model.getLineLength(lnNum) + 1,
              message: error,
              severity: monaco.MarkerSeverity.Error,
            })
          }
        })
        console.log('markers is ', markers);
        monaco.editor.setModelMarkers(model, 'c', markers);
        console.log('Current Markers:', monaco.editor.getModelMarkers({ resource: model.uri }));
  
      }
    }
    applyMarkers();
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        model.onDidChangeContent(() => {
          applyMarkers();
        });
      }
    }
    
  }, [codeError])

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const newDecorations = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        let decoration = {};
        if (lineNumToHighlight.has(parseInt(lineNum))) {
          decoration = {
            range: new monaco.Range(parseInt(lineNum), 1, parseInt(lineNum), 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-text-${colour}`,
            },
          };
        } else {
          decoration = {
            range: new monaco.Range(parseInt(lineNum), 1, parseInt(lineNum), 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-${colour}`,
            },
          };
        }
        
        newDecorations.push(decoration);
      }
      decorationsRef.current.set(newDecorations);
    }
  }, [lineNumToHighlight]);

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const newDecorations = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        const decoration = {
          range: new monaco.Range(parseInt(lineNum), 1, parseInt(lineNum), 1),
          options: {
            isWholeLine: true,
            inlineClassName: `line-decoration-${colour}`,
          },
        };
        newDecorations.push(decoration);
      }
      // oldLineHighlights.add(parseInt(lineNum));
      decorationsRef.current.set(newDecorations);
    }
    }, [lineNumDetails]);

  /*
  d9f0e9
Ffffe3
e9e8f1
ffd6d2
d4e5ee
d5e4ef
ffe5c9
e5f4cd
f2f2f0
e9d6e7
edf8ea
Fff8cf

d5f1ec
  */
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

  return (
    <>
    <div>
    <Editor
      height="90vh"
      language="c"
      theme="vs-light"
      value={code}
      onMount={handleEditorDidMount}
      options={{ fontSize: codeFontSize }}
    />

    </div>

    </>
    
  );
};

export default CodeEditor;