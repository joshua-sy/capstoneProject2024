import React, { useState, useEffect } from 'react';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import submitCodeFetch from '../../api.ts';
import NavBar from '../../components/navBar/Navbar.tsx';
import SettingsModal from '../../components/settingsModal/SettingsModal.tsx';
import './graphsPage.css';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import ShareLZSettingsModal from '../../components/shareLZSettingsModal/shareLZSettingsModal.tsx';
import { Share } from '@mui/icons-material';
// import D3Graph from '../../components/output/d3Graph/D3Graph';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

interface DecompressedSettings {
  code?: string;
  selectedCompileOptions?: compileOption[];
  selectedExecutableOptions?: string[];
}
interface compileOption {
  value: string;
  label: string;
}

const compileOptions = [
  { value: '-g', label: '-g' },
  { value: '-c', label: '-c' },
  { value: '-S', label: '-S' },
  { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
  { value: '-emit-llvm', label: '-emit-llvm' },
  { value: '-pass-exit-codes', label: '-pass-exit-codes' },
  { value: '-E', label: '-E' },
  { value: '-v', label: '-v' },
  { value: '-pipe', label: '-pipe' },
  { value: '--help', label: '--help' },
  { value: '-fcanon-prefix-map', label: '-fcanon-prefix-map' },
];

const executableOptions = [
  { value: 'mta', label: 'mta' },
  { value: 'saber', label: 'saber' },
  { value: 'ae -overflow', label: 'ae' },
];

function GraphsPage() {
  const inlineStyles = {
    container: {
      display: 'flex',
    },
  };
  const callGraph = "digraph \"Call Graph\" {\n\tlabel=\"Call Graph\";\n\n\tNode0x5cf12bc391c0 [shape=record,shape=Mrecord,label=\"{CallGraphNode ID: 1 \\{fun: printf\\}}\"];\n\tNode0x5cf12bc39640 [shape=record,shape=box,label=\"{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}\"];\n\tNode0x5cf12bc39640:s0 -> Node0x5cf12bc391c0[color=black];\n}\n";

  const icfgGraph = ` digraph "ICFG" {
    label="ICFG";

    Node0x151f11e10 [shape=record,color=purple,label="{GlobalICFGNode0\\nCopyStmt: [Var1 \\<-- Var0]  \\n ptr null \\{ constant data \\}\\nAddrStmt: [Var16 \\<-- Var17]  \\n i32 1 \\{ constant data \\}\\nAddrStmt: [Var35 \\<-- Var36]  \\n i32 0 \\{ constant data \\}\\nAddrStmt: [Var30 \\<-- Var31]  \\n i32 2 \\{ constant data \\}\\nAddrStmt: [Var4 \\<-- Var5]  \\nFunction: test \\{ \\"ln\\": 8, \\"file\\": \\"./test3.c\\" \\}\\nAddrStmt: [Var37 \\<-- Var38]  \\nFunction: llvm.dbg.declare \\nAddrStmt: [Var23 \\<-- Var24]  \\nFunction: svf_assert \\nAddrStmt: [Var45 \\<-- Var46]  \\nFunction: main \\{ \\"ln\\": 23, \\"file\\": \\"./test3.c\\" \\}\\nAddrStmt: [Var52 \\<-- Var53]  \\nFunction: llvm.dbg.value }"];
    Node0x151f11e10 -> Node0x151f10810[style=solid];
    Node0x151f11ea0 [shape=record,color=yellow,label="{FunEntryICFGNode1 \\{fun: test\\{ \\"ln\\": 8, \\"file\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f11ea0 -> Node0x151f11fc0[style=solid];
    Node0x151f11fc0 [shape=record,color=black,label="{IntraICFGNode2 \\{fun: test\\{ \\"ln\\": 12, \\"cl\\": 11, \\"fl\\": \\"./test3.c\\" \\}\\}\\nCmpStmt: [Var13 \\<-- (Var7 predicate38 Var8)]  \\n   %cmp = icmp sgt i32 %a, %b, !dbg !20 \\{ \\"ln\\": 12, \\"cl\\": 11, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f11fc0 -> Node0x151f17070[style=solid];
    Node0x151f17070 [shape=record,color=black,label="{IntraICFGNode3 \\{fun: test\\{ \\"ln\\": 12, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}\\}\\nBranchStmt: [Condition Var13]\\nSuccessor 0 ICFGNode4   Successor 1 ICFGNode5   \\n   br i1 %cmp, label %if.then, label %if.else, !dbg !22 \\{ \\"ln\\": 12, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f17070 -> Node0x151f121a0[style=solid];
    Node0x151f17070 -> Node0x151f104d0[style=solid];
    Node0x151f121a0 [shape=record,color=black,label="{IntraICFGNode4 \\{fun: test\\{ \\"ln\\": 13, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}\\}\\nBinaryOPStmt: [Var15 \\<-- (Var16 opcode13 Var16)]  \\n   %inc = add nsw i32 1, 1, !dbg !23 \\{ \\"ln\\": 13, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f121a0 -> Node0x151f129b0[style=solid];
    Node0x151f104d0 [shape=record,color=black,label="{IntraICFGNode5 \\{fun: test\\{ \\"ln\\": 17, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}\\}\\nBinaryOPStmt: [Var27 \\<-- (Var16 opcode13 Var16)]  \\n   %inc3 = add nsw i32 1, 1, !dbg !29 \\{ \\"ln\\": 17, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f104d0 -> Node0x151f10220[style=solid];
    Node0x151f129b0 [shape=record,color=black,label="{IntraICFGNode6 \\{fun: test\\{ \\"ln\\": 14, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}\\}\\nBinaryOPStmt: [Var19 \\<-- (Var16 opcode13 Var16)]  \\n   %inc1 = add nsw i32 1, 1, !dbg !25 \\{ \\"ln\\": 14, \\"cl\\": 10, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f129b0 -> Node0x151f1b5b0[style=solid];
    Node0x151f10220 [shape=record,color=black,label="{IntraICFGNode7 \\{fun: test\\{ \\"ln\\": 18, \\"cl\\": 23, \\"fl\\": \\"./test3.c\\" \\}\\}\\nCmpStmt: [Var29 \\<-- (Var27 predicate32 Var30)]  \\n   %cmp4 = icmp eq i32 %inc3, 2, !dbg !31 \\{ \\"ln\\": 18, \\"cl\\": 23, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f10220 -> Node0x151f1bab0[style=solid];
    Node0x151f1b5b0 [shape=record,color=black,label="{IntraICFGNode8 \\{fun: test\\{ \\"ln\\": 15, \\"cl\\": 23, \\"fl\\": \\"./test3.c\\" \\}\\}\\nCmpStmt: [Var21 \\<-- (Var15 predicate32 Var19)]  \\n   %cmp2 = icmp eq i32 %inc, %inc1, !dbg !26 \\{ \\"ln\\": 15, \\"cl\\": 23, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f1b5b0 -> Node0x151f1b7b0[style=solid];
    Node0x151f1bab0 [shape=record,color=red,label="{CallICFGNode9 \\{fun: test\\{ \\"ln\\": 18, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f1bab0 -> Node0x151f1bbd0[style=solid];
    Node0x151f1bbd0 [shape=record,color=blue,label="{RetICFGNode10 \\{fun: test\\{ \\"ln\\": 18, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f1bbd0 -> Node0x151f16cb0[style=solid];
    Node0x151f1b7b0 [shape=record,color=red,label="{CallICFGNode11 \\{fun: test\\{ \\"ln\\": 15, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f1b7b0 -> Node0x151f1b950[style=solid];
    Node0x151f1b950 [shape=record,color=blue,label="{RetICFGNode12 \\{fun: test\\{ \\"ln\\": 15, \\"cl\\": 9, \\"fl\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f1b950 -> Node0x151f16e40[style=solid];
    Node0x151f16cb0 [shape=record,color=black,label="{IntraICFGNode13 \\{fun: test\\}\\nBranchStmt: [ Unconditional branch]\\nSuccessor 0 ICFGNode15   \\n   br label %if.end }"];
    Node0x151f16cb0 -> Node0x151f186e0[style=solid];
    Node0x151f16e40 [shape=record,color=black,label="{IntraICFGNode14 \\{fun: test\\{ \\"ln\\": 16, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\nBranchStmt: [ Unconditional branch]\\nSuccessor 0 ICFGNode15   \\n   br label %if.end, !dbg !28 \\{ \\"ln\\": 16, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f16e40 -> Node0x151f186e0[style=solid];
    Node0x151f186e0 [shape=record,color=black,label="{IntraICFGNode15 \\{fun: test\\{ \\"ln\\": 20, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\n   ret i32 0, !dbg !33 \\{ \\"ln\\": 20, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f186e0 -> Node0x151f10670[style=solid];
    Node0x151f10670 [shape=record,color=green,label="{FunExitICFGNode16 \\{fun: test\\{ \\"ln\\": 20, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\nPhiStmt: [Var6 \\<-- ([Var35, ICFGNode15],)]  \\n   ret i32 0, !dbg !33 \\{ \\"ln\\": 20, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}|{<s0>0x151f1d210}}"];
    Node0x151f10670:s0 -> Node0x151f13330[style=solid,color=blue];
    Node0x151f10810 [shape=record,color=yellow,label="{FunEntryICFGNode17 \\{fun: main\\{ \\"ln\\": 23, \\"file\\": \\"./test3.c\\" \\}\\}}"];
    Node0x151f10810 -> Node0x151f18480[style=solid];
    Node0x151f18480 [shape=record,color=red,label="{CallICFGNode18 \\{fun: main\\{ \\"ln\\": 26, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\nCallPE: [Var7 \\<-- Var16]  \\n   %call = call i32 @test(i32 noundef 1, i32 noundef 2), !dbg !18 \\{ \\"ln\\": 26, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\nCallPE: [Var8 \\<-- Var30]  \\n   %call = call i32 @test(i32 noundef 1, i32 noundef 2), !dbg !18 \\{ \\"ln\\": 26, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}|{<s0>0x151f1d210}}"];
    Node0x151f18480:s0 -> Node0x151f11ea0[style=solid,color=red];
    Node0x151f13330 [shape=record,color=blue,label="{RetICFGNode19 \\{fun: main\\{ \\"ln\\": 26, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\nRetPE: [Var50 \\<-- Var6]  \\n   %call = call i32 @test(i32 noundef 1, i32 noundef 2), !dbg !18 \\{ \\"ln\\": 26, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f13330 -> Node0x151f138f0[style=solid];
    Node0x151f138f0 [shape=record,color=black,label="{IntraICFGNode20 \\{fun: main\\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\n   ret i32 0, !dbg !41 \\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
    Node0x151f138f0 -> Node0x151f135b0[style=solid];
    Node0x151f135b0 [shape=record,color=green,label="{FunExitICFGNode21 \\{fun: main\\{ \\"ln\\": 0, \\"cl\\": 0, \\"fl\\": \\"./test3.c\\" \\}\\}\\nPhiStmt: [Var47 \\<-- ([Var35, ICFGNode20],)]  \\n   ret i32 0, !dbg !41 \\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
  }
  `;
  const [codeError, setCodeError] = useState([])
  const [currCodeLineNum, setCurrCodeLineNum] = useState(0);
  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
  const [selectedExecutableOptions, setSelectedExecutableOptions] = useState([]);

  const [lineNumDetails, setLineNumDetails] = useState<{ [key: string]: { nodeOrllvm: string[], colour: string } }>({});
  const [code, setCode] = useState(
    `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
} IntArray;

IntArray* createIntArray(int size) {
    IntArray *arr = malloc(sizeof(IntArray)); // Memory leak: no free for arr
    arr->size = size;
    arr->data = malloc(size * sizeof(int)); // Memory leak: no free for arr->data
    for (int i = 0; i < size; i++) {
        arr->data[i] = i; // Initialize the array
    }
    return arr;
}

void useIntArray(IntArray *arr) {
    // Just a placeholder function to simulate use
    for (int i = 0; i < arr->size; i++) {
        printf("%d ", arr->data[i]);
    }
    printf("n");
}

int main() {
    IntArray *array1 = createIntArray(5);
    IntArray *array2 = createIntArray(10);

    useIntArray(array1);
    useIntArray(array2);

    // Memory leaks: no free for array1 and array2

    return 0;
}
`
  );

  const [lineNumToHighlight, setlineNumToHighlight] = useState<Set<number>>(new Set());
  const [terminalOutputString, setTerminalOutputString] = useState('Run the code to see the terminal output here');
  const [llvmIRString, setllvmIRString] = useState('Run the code to see the LLVM IR of your here');
  const [graphs, setGraphs] = useState({});
  const [savedMessages, setSavedMessages] = useState<{ role: string, content: string }[]>([]);
  const [passedPrompt, setPassedPrompt] = useState('');

  const [tabPositions, setTabPositions] = useState<Record<OutputType, string>>({
    Graph: 'main',
    'Terminal Output': 'main',
    CodeGPT: 'main',
    LLVMIR: 'main',
  });

  const renderComponent = (tab: OutputType) => {
    switch (currentOutput) {
      case 'Graph':
        return (
          <DotGraphViewer
            dotGraphString={callGraph}
            lineNumToHighlight={lineNumToHighlight}
            setlineNumToHighlight={setlineNumToHighlight}
            graphObj={graphs}
            setLineNumDetails={setLineNumDetails}
            lineNumDetails={lineNumDetails}
            currCodeLineNum={currCodeLineNum}
            code={code}
          />
        );
      case 'Terminal Output':
        return <TerminalOutput terminalOutputString={terminalOutputString} />;
      case 'CodeGPT':
        return (
          <CodeGPT
            code={code}
            graphs={graphs}
            terminalOutput={terminalOutputString}
            llvmIR={llvmIRString}
            savedMessages={savedMessages}
            onSaveMessages={setSavedMessages}
            passedPrompt={passedPrompt}
          />
        );
      case 'LLVMIR':
        return <LLVMIR LLVMIRString={llvmIRString} code={code} lineNumDetails={lineNumDetails} setLineNumDetails={setLineNumDetails}/>;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (passedPrompt !== '') {
      setCurrentOutput('CodeGPT');
      renderComponent('CodeGPT');
    }
  }, [passedPrompt])

  const submitCode = async () => {
    const selectedCompileOptionString = selectedCompileOptions.map(option => option.value).join(' ');
    const selectedExecutableOptionsList = selectedExecutableOptions.map(option => option.value);
    console.log('selected execitan;e options: ', selectedExecutableOptionsList);

    const response = await submitCodeFetch(code, selectedCompileOptionString, selectedExecutableOptionsList);
    console.log('response from submit', response);
    if ('name' in response) {
      if (response.name == 'Resultant Graphs') {
        const respGraphs = response.graphs;
        const graphObj = {};
        respGraphs.forEach(graph => {
          graphObj[graph.name] = graph.graph;
        });
        setGraphs(graphObj);
        setllvmIRString(response.llvm);
        setTerminalOutputString(response.output);
        console.log(response.error);
        setCodeError(formatErrorLogs(response.error));
      } else if (response.name == 'Clang Error') {
        setTerminalOutputString(response.error);
        setCodeError(formatClangErrors(response.error));
      }
      
    }
    
  };

  // It formats the error messages it receives from clang
  // Function is used if it did not pass clang
  const formatClangErrors = (stdErr: string) => {
    const errorList = stdErr.split('\n');
    console.log('formatClangErrors',errorList);
    let errorMsg = '';
    const regex = /example.c:(\d+):(\d+)/;
    let formattedErrors = [];
    // The last element of the array is sentence on how many errors and warnings were generated
    for (let i = 0; i < errorList.length - 1; i++) {
      let match = errorList[i].match(regex);
      if (match) {
        console.log('match', errorList[i]);
        if (errorMsg !== '') {
          formattedErrors.push(errorMsg);
        }
        errorMsg = 'CLANG:\n' + errorList[i];
      } else {
        errorMsg = errorMsg + '\n' +errorList[i];
      }
    }
    if (errorMsg !== '') {
      formattedErrors.push(errorMsg);
    }
    console.log('formattedErrors', formattedErrors);

    return formattedErrors;

  }

  // It formats the Error messages it receives
  // This is used when the code is compiled by clang
  const formatErrorLogs = (stdErr: string) => {
    console.log('std err is ', stdErr);
    const errorList = stdErr.split('\n');
    console.log('errorList is ', errorList)
    let formattedErrors = [];
    let i = 0;
    let numOverflow = 0;
    while (i < errorList.length) {
      if (errorList[i].includes('NeverFree')) {
        formattedErrors.push('MEMORY LEAK: ' + errorList[i]);
      } else if (errorList[i].includes('######################Buffer Overflow')) {
        numOverflow = parseInt(errorList[i].match(/\d+/)[0], 10);
      } else if (errorList[i].includes("---------------------------------------------") && numOverflow > 0) {
        formattedErrors.push("BUFFER OVERFLOW: " + errorList[i+1] + errorList[i+2]);
        i = i + 2;
        numOverflow--;
      }

      i++;
    }
    return formattedErrors;

  }

  const resetDefault = () => {
    setSelectedCompileOptions([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
    setSelectedExecutableOptions([]);
  };

  const [openSettings, setOpenSettings] = React.useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const [codeFontSize, setCodeFontSize] = useState(16);
  const createLZStringUrl = () => {
    const url = window.location.href;
    const currRoute = url.split('?')[0];
    const savedSettings = {
      code: code,
      selectedCompileOptions: selectedCompileOptions,
      selectedExecutableOptions: selectedExecutableOptions,
    };
    const compressed = compressToEncodedURIComponent(JSON.stringify(savedSettings));
    return currRoute + '?data=' + compressed;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let compressedFromURL = urlParams.get('data');
    console.log('compressed from url ', compressedFromURL);
    if (compressedFromURL) {
      let decompressedSettings: DecompressedSettings = {};
      if (compressedFromURL.startsWith('${')) {
        compressedFromURL = compressedFromURL.replace('${', '');
        const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
        decompressedSettings = JSON.parse(decompressedSettingsString);
      } else {
        const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
        decompressedSettings = JSON.parse(decompressedSettingsString);
      }
      console.log(decompressedSettings);
      if (decompressedSettings.hasOwnProperty('code')) {
        console.log('decompressed settings.code is ', decompressedSettings.code)
        setCode(decompressedSettings.code);
        console.log('code is ', code);
      } 
      if (decompressedSettings.hasOwnProperty('selectedCompileOptions')) {
        setSelectedCompileOptions(decompressedSettings.selectedCompileOptions);
      }
      if (decompressedSettings.hasOwnProperty('selectedExecutableOptions')) {
        setSelectedExecutableOptions(decompressedSettings.selectedExecutableOptions);
      }
    }
  }, []);
  
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const handleOpenShareModal = () => setOpenShareModal(true);
  const handleCloseShareModal = () => setOpenShareModal(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (openShareModal === true) {
      setShareLink(createLZStringUrl());
    }
  }, [openShareModal]);


  
  const [isCodeLeft, setIsCodeLeft] = useState(true);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [draggedTab, setDraggedTab] = useState<OutputType | null>(null);
  const [isThirdWindowVisible, setIsThirdWindowVisible] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: string | OutputType) => {
    if (typeof element === 'string') {
      // Dragging the entire container (left or right)
      setDraggedElement(element);
    } else {
      // Dragging a tab
      setDraggedTab(element);
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, target: string) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");

    if (target === 'third-dropzone' && draggedTab) {
      setIsThirdWindowVisible(true); // Show third window when dragging a tab over dropzone
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, target: string) => {
    e.currentTarget.classList.remove("drag-over");

    if (target === 'third-dropzone' && draggedTab) {
      setIsThirdWindowVisible(false); // Hide third window if tab leaves dropzone
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    if (draggedElement && draggedElement !== target) {
      if ((draggedElement === "code" && target === "output") || (draggedElement === "output" && target === "code")) {
        setIsCodeLeft(!isCodeLeft);
      }
      setDraggedElement(null);
    } else if (draggedTab) {
      setTabPositions((prev) => ({
        ...prev,
        [draggedTab]: target === 'third-dropzone' ? 'third' : 'main',
      }));
      setDraggedTab(null);
      setIsThirdWindowVisible(false);
    }
  };


  return (
    <>
      <ShareLZSettingsModal open={openShareModal}
        handleClose={handleCloseShareModal}
        shareLink={shareLink}
        />
      <NavBar 
        openShare={handleOpenShareModal}
      />
      <div id='graph-page-container' style={inlineStyles.container}>
        <div
          id='graph-page-code-container'
          draggable
          onDragStart={(e) => handleDragStart(e, "code")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "code")}
          className={isCodeLeft ? 'left' : 'right'}
          style={{ width: '50%' }}
        >
          <SubmitCodeBar
            submitEvent={submitCode}
            resetCompileOptions={resetDefault}
            compileOptions={compileOptions}
            selectedCompileOptions={selectedCompileOptions}
            setSelectedCompileOptions={setSelectedCompileOptions}
            executableOptions={executableOptions}
            selectedExecutableOptions={selectedExecutableOptions}
            setSelectedExecutableOptions={setSelectedExecutableOptions}
          />
          <CodeEditor
            code={code}
            setCode={setCode}
            lineNumToHighlight={lineNumToHighlight}
            lineNumDetails={lineNumDetails}
            setCurrCodeLineNum={setCurrCodeLineNum}
            codeError={codeError}
            setPassedPrompt={setPassedPrompt}
          />
        </div>
        <div
          id='graph-page-output-container'
          draggable
          onDragStart={(e) => handleDragStart(e, "output")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "output")}
          className={isCodeLeft ? 'right' : 'left'}
          style={{ width: '50%', display: 'flex', flexDirection: 'column' }}
        >
          <OutputMenuBar
              currentOutput={currentOutput}
              setCurrentOutput={setCurrentOutput}
              onDragStartTab={(tab) => handleDragStart(null, tab)}
          />
          <div
            style={{ flexGrow: 1 }}
            onDrop={(e) => handleDrop(e, "main")}
            onDragOver={(e) => e.preventDefault()}
          >
            {renderComponent(currentOutput)}
          </div>

          {/* Third Window (will appear when a tab is dragged into it) */}
          {Object.values(tabPositions).includes('third') && (
            <div
              className="third-window"
              style={{
                borderTop: '1px solid #ddd',
                padding: '10px',
                marginTop: '10px',
                minHeight: '200px',
              }}
              onDrop={(e) => handleDrop(e, "third")}
              onDragOver={(e) => e.preventDefault()}
            >
              {Object.entries(tabPositions).map(([tab, position]) =>
                position === 'third' ? (
                  <div key={tab} draggable>
                    {renderComponent(tab as OutputType)}
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GraphsPage;
