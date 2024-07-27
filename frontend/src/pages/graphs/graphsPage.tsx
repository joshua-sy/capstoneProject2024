import React, { useState } from 'react';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import submitCodeFetch from '../../api.ts';
import TabOutput from '../../components/output/tabOutput/TabOutput';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

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
]

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function GraphsPage() {
  const inlineStyles = {
    container: {
      display: 'flex',
      // justifyContent: 'space-between',      
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
	Node0x151f138f0 [shape=record,color=black,label="{IntraICFGNode20 \\{fun: main\\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}\\}\\n   ret i32 0, !dbg !19 \\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
	Node0x151f138f0 -> Node0x151f135b0[style=solid];
	Node0x151f135b0 [shape=record,color=green,label="{FunExitICFGNode21 \\{fun: main\\{ \\"ln\\": 0, \\"cl\\": 0, \\"fl\\": \\"./test3.c\\" \\}\\}\\nPhiStmt: [Var47 \\<-- ([Var35, ICFGNode20],)]  \\n   ret i32 0, !dbg !19 \\{ \\"ln\\": 27, \\"cl\\": 5, \\"fl\\": \\"./test3.c\\" \\}}"];
}
`


  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);

  // const readFile = async () => {
  //   const response = await fetch('/icfg.dot');
  //   if (!response.ok) {
  //     console.error('Failed to fetch the file:', response.statusText);
  //     return '';
  //   }
  
  //   const text = await response.text();
  //   console.log('Contents of icfg.dot:', text);
  //   return text;
  // };
  // const graph: string = await readFile();
  const [code, setCode] = useState(
    ` #include "stdbool.h"
// CHECK: ^sat$

extern int nd(void);

extern void svf_assert(bool);

int test(int a, int b){
    int x,y;
    x=1; y=1;

    if (a > b) {
        x++;
        y++;
        svf_assert (x == y);
    } else {
        x++;
        svf_assert (x == 2);
    }
    return 0;
}

int main(){
    int a = 1;
    int b = 2;
    test(a,b);
    return 0;
}`
    );

    // const lineNumToHighlight: number[] = [];
    const [lineNumToHighlight, setlineNumToHighlight] = useState<number[]>([]);

    const [terminalOutputString, setTerminalOutputString] = useState('Run the code to see the terminal output here');
    const [llvmIRString, setllvmIRString] = useState('Run the code to see the LLVM IR of your here');
    const [graphs, setGraphs] = useState({});


    
    const renderComponent = () => {
        switch (currentOutput) {
            case 'Graph':
                return <DotGraphViewer dotGraphString={callGraph} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight} graphObj={graphs}/>;
            case 'Terminal Output':
                return <TerminalOutput terminalOutputString={terminalOutputString}/>;
            case 'CodeGPT':
                return <CodeGPT />;
            case 'LLVMIR':
                return <LLVMIR LLVMIRString={llvmIRString}/>;
            // default:
            //     return <DotGraphViewer dotGraphString={icfgGraph} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight}/>;
        }
    };

    const submitCode = async () => {
      const selectedCompileOptionString = selectedCompileOptions.map(option => option.value).join(' ');
      const response = await submitCodeFetch(code, selectedCompileOptionString);
      const respGraphs = response.graphs;
      const graphObj = {};
      respGraphs.forEach(graph => {
        graphObj[graph.name] = graph.graph;
      });
      setGraphs(graphObj);
      console.log('graphObj', graphObj);
      console.log('submit code response' ,response);
      setllvmIRString(`; ModuleID = './test3.ll'
source_filename = "./test3.c"
target datalayout = "e-m:o-i64:64-i128:128-n32:64-S128"
target triple = "arm64-apple-macosx14.0.0"

; Function Attrs: noinline nounwind ssp uwtable(sync)
define i32 @test(i32 noundef %a, i32 noundef %b) #0 !dbg !9 {
entry:
  call void @llvm.dbg.value(metadata i32 %a, metadata !15, metadata !DIExpression()), !dbg !16
  call void @llvm.dbg.value(metadata i32 %b, metadata !17, metadata !DIExpression()), !dbg !16
  call void @llvm.dbg.value(metadata i32 1, metadata !18, metadata !DIExpression()), !dbg !16
  call void @llvm.dbg.value(metadata i32 1, metadata !19, metadata !DIExpression()), !dbg !16
  %cmp = icmp sgt i32 %a, %b, !dbg !20
  br i1 %cmp, label %if.then, label %if.else, !dbg !22

if.then:                                          ; preds = %entry
  %inc = add nsw i32 1, 1, !dbg !23
  call void @llvm.dbg.value(metadata i32 %inc, metadata !18, metadata !DIExpression()), !dbg !16
  %inc1 = add nsw i32 1, 1, !dbg !25
  call void @llvm.dbg.value(metadata i32 %inc1, metadata !19, metadata !DIExpression()), !dbg !16
  %cmp2 = icmp eq i32 %inc, %inc1, !dbg !26
  call void @svf_assert(i1 noundef zeroext %cmp2), !dbg !27
  br label %if.end, !dbg !28

if.else:                                          ; preds = %entry
  %inc3 = add nsw i32 1, 1, !dbg !29
  call void @llvm.dbg.value(metadata i32 %inc3, metadata !18, metadata !DIExpression()), !dbg !16
  %cmp4 = icmp eq i32 %inc3, 2, !dbg !31
  call void @svf_assert(i1 noundef zeroext %cmp4), !dbg !32
  br label %if.end

if.end:                                           ; preds = %if.else, %if.then
  ret i32 0, !dbg !33
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare void @llvm.dbg.declare(metadata, metadata, metadata) #1

declare void @svf_assert(i1 noundef zeroext) #2

; Function Attrs: noinline nounwind ssp uwtable(sync)
define i32 @main() #0 !dbg !34 {
entry:
  call void @llvm.dbg.value(metadata i32 1, metadata !37, metadata !DIExpression()), !dbg !38
  call void @llvm.dbg.value(metadata i32 2, metadata !39, metadata !DIExpression()), !dbg !38
  %call = call i32 @test(i32 noundef 1, i32 noundef 2), !dbg !40
  ret i32 0, !dbg !41
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare void @llvm.dbg.value(metadata, metadata, metadata) #1

attributes #0 = { noinline nounwind ssp uwtable(sync) "frame-pointer"="non-leaf" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="apple-m1" "target-features"="+aes,+crc,+crypto,+dotprod,+fp-armv8,+fp16fml,+fullfp16,+lse,+neon,+ras,+rcpc,+rdm,+sha2,+sha3,+sm4,+v8.1a,+v8.2a,+v8.3a,+v8.4a,+v8.5a,+v8a,+zcm,+zcz" }
attributes #1 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #2 = { "frame-pointer"="non-leaf" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="apple-m1" "target-features"="+aes,+crc,+crypto,+dotprod,+fp-armv8,+fp16fml,+fullfp16,+lse,+neon,+ras,+rcpc,+rdm,+sha2,+sha3,+sm4,+v8.1a,+v8.2a,+v8.3a,+v8.4a,+v8.5a,+v8a,+zcm,+zcz" }

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2, !3, !4, !5, !6, !7}
!llvm.ident = !{!8}

!0 = distinct !DICompileUnit(language: DW_LANG_C11, file: !1, producer: "Homebrew clang version 16.0.6", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug, splitDebugInlining: false, nameTableKind: None, sysroot: "/Library/Developer/CommandLineTools/SDKs/MacOSX14.sdk", sdk: "MacOSX14.sdk")
!1 = !DIFile(filename: "test3.c", directory: "/Users/z5489735/2023/0513/Software-Security-Analysis/Assignment-2/Tests/testcases/sse")
!2 = !{i32 7, !"Dwarf Version", i32 4}
!3 = !{i32 2, !"Debug Info Version", i32 3}
!4 = !{i32 1, !"wchar_size", i32 4}
!5 = !{i32 8, !"PIC Level", i32 2}
!6 = !{i32 7, !"uwtable", i32 1}
!7 = !{i32 7, !"frame-pointer", i32 1}
!8 = !{!"Homebrew clang version 16.0.6"}
!9 = distinct !DISubprogram(name: "test", scope: !10, file: !10, line: 8, type: !11, scopeLine: 8, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !14)
!10 = !DIFile(filename: "./test3.c", directory: "/Users/z5489735/2023/0513/Software-Security-Analysis/Assignment-2/Tests/testcases/sse")
!11 = !DISubroutineType(types: !12)
!12 = !{!13, !13, !13}
!13 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!14 = !{}
!15 = !DILocalVariable(name: "a", arg: 1, scope: !9, file: !10, line: 8, type: !13)
!16 = !DILocation(line: 0, scope: !9)
!17 = !DILocalVariable(name: "b", arg: 2, scope: !9, file: !10, line: 8, type: !13)
!18 = !DILocalVariable(name: "x", scope: !9, file: !10, line: 9, type: !13)
!19 = !DILocalVariable(name: "y", scope: !9, file: !10, line: 9, type: !13)
!20 = !DILocation(line: 12, column: 11, scope: !21)
!21 = distinct !DILexicalBlock(scope: !9, file: !10, line: 12, column: 9)
!22 = !DILocation(line: 12, column: 9, scope: !9)
!23 = !DILocation(line: 13, column: 10, scope: !24)
!24 = distinct !DILexicalBlock(scope: !21, file: !10, line: 12, column: 16)
!25 = !DILocation(line: 14, column: 10, scope: !24)
!26 = !DILocation(line: 15, column: 23, scope: !24)
!27 = !DILocation(line: 15, column: 9, scope: !24)
!28 = !DILocation(line: 16, column: 5, scope: !24)
!29 = !DILocation(line: 17, column: 10, scope: !30)
!30 = distinct !DILexicalBlock(scope: !21, file: !10, line: 16, column: 12)
!31 = !DILocation(line: 18, column: 23, scope: !30)
!32 = !DILocation(line: 18, column: 9, scope: !30)
!33 = !DILocation(line: 20, column: 5, scope: !9)
!34 = distinct !DISubprogram(name: "main", scope: !10, file: !10, line: 23, type: !35, scopeLine: 23, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !14)
!35 = !DISubroutineType(types: !36)
!36 = !{!13}
!37 = !DILocalVariable(name: "a", scope: !34, file: !10, line: 24, type: !13)
!38 = !DILocation(line: 0, scope: !34)
!39 = !DILocalVariable(name: "b", scope: !34, file: !10, line: 25, type: !13)
!40 = !DILocation(line: 26, column: 5, scope: !34)
!41 = !DILocation(line: 27, column: 5, scope: !34)
`);
    }

    const resetDefault = () => {
      setSelectedCompileOptions([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
    }

  return (
    <>
      <div style={inlineStyles.container}>
        <div style={{width:'50%'}}>
          <SubmitCodeBar submitEvent={submitCode} resetCompileOptions={resetDefault} compileOptions={compileOptions} selectedCompileOptions={selectedCompileOptions} setSelectedCompileOptions={setSelectedCompileOptions}/>
          <CodeEditor code={code} setCode={setCode} lineNumToHighlight={lineNumToHighlight}/>
        </div>



        <div style={{width:'50%'}}>
          <OutputMenuBar setCurrentOutput={setCurrentOutput}/>
          <div>
            {renderComponent()}
          </div>
          {/* <TabOutput dotGraphString={icfgGraph} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight}/> */}
        </div>
      </div>

    </>
  )
}

export default GraphsPage