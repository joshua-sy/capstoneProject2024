import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './styles.css';

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
  const [decorationCollection, setDecorationsCollection] = useState<monaco.editor.IEditorDecorationsCollection | null>(null);
  const decorationsRef = useRef(null);


  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection();
    setDecorationsCollection(editor.createDecorationsCollection());

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
    if (editorRef.current && decorationCollection.current !== null) {
      // const newDecorations = editorRef.current.deltaDecorations(
      //   decorations,
      //   [
      //     {
      //       range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      //       options: {
      //         isWholeLine: true,
      //         inlineClassName: `line-decoration-${colour}`,
      //       },
      //     },
      //     // {
      //     //   range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      //     //   options: {
      //     //     // isWholeLine: true,
      //     //     inlineClassName: "myLineDecoration",
      //     //   },
      //     // },
      //   ]
      // );
      console.log('decoration collection is in highlightLine', decorationCollection);
      // if (decorationCollection !== null) {
      //   decorationCollection.set([
      //     {
      //       range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      //       options: {
      //         isWholeLine: true,
      //         inlineClassName: `line-decoration-${colour}`,
      //       },
      //     },
      //   ]);
      // }
      
        const newDecorations = [
          {
            range: new monaco.Range(4, 1, 4, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-text-${colour}`,
            },
          },
        ];
    
        // Apply decorations
        decorationsRef.current.set(newDecorations);
      

      //   decorationCollection.append([
      //     {
      //       range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      //       options: {
      //         isWholeLine: true,
      //         inlineClassName: `line-decoration-${colour}`,
      //       },
      //     },
      //   ]
      // );
      
      
      // setDecorations(newDecorations);
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

  const textColorToRed = (lineNumber: number, colour: string) => {
    // if (editorRef.current) {
    //   const newDecorations = editorRef.current.deltaDecorations(
    //     decorations,
    //     [
    //       {
    //         range: new monaco.Range(lineNumber, 1, lineNumber, 1),
    //         options: {
    //           isWholeLine: true,
    //           inlineClassName: `line-decoration-text-${colour}`,
    //         },
    //       },
    //       // {
    //       //   range: new monaco.Range(lineNumber, 1, lineNumber, 1),
    //       //   options: {
    //       //     // isWholeLine: true,
    //       //     inlineClassName: "myLineDecoration",
    //       //   },
    //       // },
    //     ]
    //   );
    //   setDecorations(newDecorations);

    // };
  } 

  useEffect(() => {

    // if (lineNumToHighlight.size > 0) {
    //   const colour = lineNumDetails[Array.from(lineNumToHighlight)[lineNumToHighlight.size - 1]]['colour'].slice(1).toLowerCase();

    //   textColorToRed(Array.from(lineNumToHighlight)[lineNumToHighlight.size - 1], colour);
    // }
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const newDecorations = [];
      const selectedLineNum = Array.from(lineNumToHighlight)[lineNumToHighlight.size - 1];
      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        let decoration = {};
        if (selectedLineNum === parseInt(lineNum)) {
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
      // oldLineHighlights.add(parseInt(lineNum));
      decorationsRef.current.set(newDecorations);
    }
  }, [lineNumToHighlight]);

  useEffect(() => {
    // console.log('triggering use effect for lineNumDetails');
    // console.log('oldHighlight', oldHighlight);
    // for (const lineNum of oldHighlight) {
    //   console.log('removing highlight from lineNum', lineNum);
    //   removeHighlightLine(lineNum);
    // }
    // const oldLineHighlights:Set<number> = new Set<number>();
    // // removeHighlightLine(oldHighlight);
    // // decorations.forEach(decoration => editorRef.current?.deltaDecorations([decoration], []));
    // console.log('lineNumDetails in code Editor', lineNumDetails);
    // for (const lineNum in lineNumDetails) {
    //   const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
    //   highlightLine(parseInt(lineNum), colour);
    //   oldLineHighlights.add(parseInt(lineNum));
    // }
    
    // let i : number = 0;
    // console.log('lineNumTohighlight in code editor', lineNumToHighlight);
    // for (const lineNum of lineNumToHighlight) {
    //   const colour = highlightColours[i % highlightColours.length];
    //   console.log('highligting lineNum', lineNum, ' with colour ', colour);
    //   highlightLine(lineNum, colour);
    //   i++;
    // }

    // setOldHighlight(oldLineHighlights);
    // lineNumToHighlight.forEach(lineNum => {
    //   highlightLine(lineNum, );
    // });
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
    />

    </div>

    </>
    
  );
};

export default CodeEditor;