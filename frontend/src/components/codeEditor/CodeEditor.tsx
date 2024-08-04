import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  lineNumToHighlight: Set<number>;
  lineNumDetails: { [key: string]: { nodes: string[], colour: string } };

}

const highlightColours = ['d9f0e9', 'ffffe3', 'e9e8f1', 'ffd6d2', 'd4e5ee', 'd5e4ef', 'ffe5c9', 'e5f4cd', 'f2f2f0', 'e9d6e7', 'edf8ea', 'fff8cf'];


const CodeEditor: React.FC<CodeEditorProps> = ({code, setCode, lineNumToHighlight, lineNumDetails}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [oldHighlight, setOldHighlight] = useState<Set<number>>(new Set<number>());

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // // Highlight line 3 after the editor has mounted
    // highlightLine(3);

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });
  };

  // Colors


  // Function to highlight a specific line
  const highlightLine = (lineNumber: number, colour: string) => {
    if (editorRef.current) {
      const newDecorations = editorRef.current.deltaDecorations(
        decorations,
        [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            options: {
              isWholeLine: true,
              className: `line-decoration-${colour}`,
            },
          },
        ]
      );
      setDecorations(newDecorations);
    }
  };

  // Function to highlight a specific line
  const removeHighlightLine = (lineNumber: number) => {
    if (editorRef.current) {
      // Get all decorations of the line
      const decorationsOfLine = editorRef.current.getLineDecorations(lineNumber);
      console.log('decorationsOfLine of line number ', lineNumber , ' is ', decorationsOfLine);
      if (decorationsOfLine !== null) {
        // From the decorations object, get the id of each decoration and add it to decorationsIds
        const decorationIds = decorationsOfLine.map(decoration => decoration.id);
        // Give list of IDs for removaDecorations to remove
        editorRef.current.removeDecorations(decorationIds);
      }
    }
  };

  // useEffect(() => {
  //   console.log('oldHighlight', oldHighlight);
  //   for (const lineNum of oldHighlight) {
  //     console.log('removing highlight from lineNum', lineNum);
  //     removeHighlightLine(lineNum);
  //   }
  //   // removeHighlightLine(oldHighlight);
  //   decorations.forEach(decoration => editorRef.current?.deltaDecorations([decoration], []));
  //   let i : number = 0;
  //   console.log('lineNumTohighlight in code editor', lineNumToHighlight);
  //   for (const lineNum of lineNumToHighlight) {
  //     const colour = highlightColours[i % highlightColours.length];
  //     console.log('highligting lineNum', lineNum, ' with colour ', colour);
  //     highlightLine(lineNum, colour);
  //     i++;
  //   }

  //   setOldHighlight(lineNumToHighlight);
  //   // lineNumToHighlight.forEach(lineNum => {
  //   //   highlightLine(lineNum, );
  //   // });
  // }, [lineNumToHighlight]);

  useEffect(() => {
    console.log('triggering use effect for lineNumDetails');
    console.log('oldHighlight', oldHighlight);
    for (const lineNum of oldHighlight) {
      console.log('removing highlight from lineNum', lineNum);
      removeHighlightLine(lineNum);
    }
    const oldLineHighlights:Set<number> = new Set<number>();
    // removeHighlightLine(oldHighlight);
    decorations.forEach(decoration => editorRef.current?.deltaDecorations([decoration], []));
    console.log('lineNumDetails in code Editor', lineNumDetails);
    for (const lineNum in lineNumDetails) {
      const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
      highlightLine(parseInt(lineNum), colour);
      oldLineHighlights.add(parseInt(lineNum));
    }
    
    // let i : number = 0;
    // console.log('lineNumTohighlight in code editor', lineNumToHighlight);
    // for (const lineNum of lineNumToHighlight) {
    //   const colour = highlightColours[i % highlightColours.length];
    //   console.log('highligting lineNum', lineNum, ' with colour ', colour);
    //   highlightLine(lineNum, colour);
    //   i++;
    // }

    setOldHighlight(oldLineHighlights);
    // lineNumToHighlight.forEach(lineNum => {
    //   highlightLine(lineNum, );
    // });
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
    />

    </div>

    </>
    
  );
};

export default CodeEditor;