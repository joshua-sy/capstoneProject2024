import React, { useCallback, useRef, useEffect, useState } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";
import * as d3 from 'd3';
import './dotGraphViewer.css';




interface DotGraphViewerProps {
  dotGraphString: string;
  lineNumToHighlight: Set<number>;
  setlineNumToHighlight: (newLineNumToHighlight: Set<number>) => void;
  graphObj: { [key: string]: string };
  lineNumDetails: { [key: string]: { nodes: string[], colour: string } };
  setLineNumDetails: (newLineNumDetails: { [key: string]: { nodes: string[], colour: string } }) => void;
  currCodeLineNum: number;
  code: string;


}

const highlightColours = ['#D9F0E9', '#FFFFE3', '#E9E8F1', '#FFD6D2', '#D4E5EE', '#D5E4EF', '#FFE5C9', '#E5F4CD', '#F2F2F0', '#E9D6E7', '#EDF8EA', '#FFF8CF'];

const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  dotGraphString,
  lineNumToHighlight,
  setlineNumToHighlight,
  graphObj,
  lineNumDetails,
  setLineNumDetails,
  currCodeLineNum,
  code,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const data = `digraph "Call Graph" {
    label="Call Graph";
  
    Node0x55fc43c981a0 [shape=record,shape=Mrecord,label="{CallGraphNode ID: 1 \\{fun: printf\\}}"];
    Node0x55fc43c98620 [shape=record,shape=box,label="{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}"];
    Node0x55fc43c98620:s0 -> Node0x55fc43c981a0[color=black];
  }`;
  const [currentGraph, setCurrentGraph] = useState('');
  const [graphString, setGraphString] = useState('');
  const graphWidth = window.innerWidth * 0.5;
  console.log('graphWidth', graphWidth);
  const graphHeight = window.innerHeight * 0.85;
  
  const graphRef = useRef(null);

  // const reset = useCallback(() => {
  //   if (graphRef.current) {
  //     const { id } = graphRef.current;
  //     graphviz(`#${id}`).resetZoom();
  //   }
  // }, [graphRef]);

  const resetZoom = () => {
    if (graphRef.current) {
      console.log('resetting zoom');
      const svg = d3.select(graphRef.current).select('svg');
      const zoom = d3.zoom().on('zoom', null); // Remove existing zoom behavior
      svg.call(zoom.transform, d3.zoomIdentity); // Reset zoom to identity (no zoom)
    }
  };



  // add an event listener to each node so an event triggers when i click on it 
  useEffect(() => {
    const graphvizContainer = graphRef.current;

    if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');
      console.log('svg', svg);
      if (svg) {
        if (currentGraph === 'callgraph.dot' || currentGraph === 'ptacg.dot' || currentGraph === 'tcg.dot') {
          svg.addEventListener('click', (event) => {
            const node = event.target.closest('g.node');
            if (node) {
              const nodeId = node.querySelector('title').textContent;
              // const nodeText = node.querySelector('text').textContent;
              const nodeTextList = node.querySelectorAll('text');
              // const nodeTextListContent = nodeTextList.map((node) => {
                
              // })
              let nodeTextContentList: string[] = [];
              nodeTextList.forEach((nodeText) => {
                nodeTextContentList.push(nodeText.textContent);
              });
              const funcPattern = /fun:\s*([^\}]+)/;
              // Finds the first function name then breaks
              let funcTofind = '';
              for (const callNodeText of nodeTextContentList) {
                console.log('callNodeText ', callNodeText, ' funcTofind is ', funcTofind);
                const match = funcPattern.exec(callNodeText);
                if (match) {
                  const funcString = match[0];
                  const removeFun = funcString.replace('fun: ', '');
                  funcTofind = removeFun;
                  break;
                }
              }
              let newlineNumToHighlight: Set<number> = new Set<number>();

              Object.keys(lineNumDetails).forEach((lineNum) => {
                const nodes = lineNumDetails[lineNum].nodes;
                console.log('nodes in call event', nodes, ' line num is ', lineNum, ' funcTofind is ', funcTofind);
                if (nodes.includes(funcTofind)) {
                  newlineNumToHighlight.add(parseInt(lineNum, 10));
                }
              });
              console.log('lineNumToHighlight for call nodes', newlineNumToHighlight);
              setlineNumToHighlight(newlineNumToHighlight);
            }              
          });
        } else {
          svg.addEventListener('click', (event) => {
            const node = event.target.closest('g.node');
            if (node) {
              console.log('node', node);
              const nodeId = node.querySelector('title').textContent;
              // const nodeText = node.querySelector('text').textContent;
              const nodeTextList = node.querySelectorAll('text');
              // const nodeTextListContent = nodeTextList.map((node) => {
                
              // })
              let nodeTextContentList: string[] = [];
              nodeTextList.forEach((nodeText) => {
                nodeTextContentList.push(nodeText.textContent);
              });
              // const lineRegex = /line*:*(\d+)/g;
              const lineRegex = /line:\s*(\d+)/g;

              // const lnRegex = /ln*:*(\d+)/g;
              const lnRegex = /ln:\s*(\d+)/g;

              const lnJsonRegex = /ln":\s*(\d+)/g;
              const lineJsonRegex = /line":\s*(\d+)/g;

              let matchLineNum;
              console.log('lineNumToHighlight',lineNumToHighlight);
              let newlineNumToHighlight: Set<number> = new Set<number>();
              console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

              // check with svf-ex on how it would spit back out examples from comp6131
              nodeTextContentList.forEach(nodeText => {
                console.log('nodeText in loop', nodeText)
                if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                }
                else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                  console.log('found num: ', parseInt(matchLineNum[1], 10));
                }
                else if ((matchLineNum = lnJsonRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                  console.log('found num: ', parseInt(matchLineNum[1], 10));
                } else if ((matchLineNum = lineJsonRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                  console.log('found num: ', parseInt(matchLineNum[1], 10));
                } 
              });
              console.log('newlineNumToHighlight AFTER', newlineNumToHighlight);
              // console.log('nodeTextList', nodeTextList);
              // console.log('nodeTextContentList', nodeTextContentList);
              setlineNumToHighlight(newlineNumToHighlight);
              // setSelectedNode(nodeId);
            }
          });
        }
          
      }
        
    }
  }, [graphString]);
  // useEffect(() => {
  //   const nodePattern = /Node\w+\s+\[shape=record,color=\w+,label="\{[^"]*\}"\];/g;

  //   const nodes = currentGraph.match(nodePattern) || [];

  //   console.log('useEffect test' ,nodes);
  // }, [currentGraph]);

  useEffect(() => {
    // const nodePattern = /Node\w+\s*\[\s*shape=record\s*,\s*color=\w+\s*,\s*label="((?:\\.|[^"\\])*)"\s*\];/g;
    // const nodePattern = /Node\w+\s*\[shape=record,\s*[^,]*,\s*label="([^"]*)"\];/g;
    // const nodePattern = /Node[\w\d]+?\s*\[shape=+?,[\s\S]*,\slabel="([^"]*)"\];/g;
    // const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

    // // Execute the regex to find a match
    // const match = graphContentPattern.exec(currentGraph);

    // if (match) {
    //   const graphContent = match[1].trim();
    //   console.log('graphContent' ,graphContent);
    //   const splitGraphContent = graphContent.split('\n\t');

    //   // Filter out any empty strings that might occur from the split
    //   const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
    //   /* Removing title of the graph
    //   e.g "label="Call Graph";"
    //   */
    //   removedEmptyStrings.shift();


    //   console.log('non empty parts',removedEmptyStrings);

    //   /*
    //   Removing edges from the list
    //   */
    //   // const edgePattern = /(\w+)\s+->\s+(\w+)/g;
    //   // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
    //   const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;

    //   const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));

    //   // Regex for line: [number]
    //   const lineRegex = /line:\s*(\d+)/g;
    //   // Regex for ln: [number]
    //   const lnRegex = /ln:\s*(\d+)/g;

    //   let matchLineNum;
    //   // console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

    //   // check with svf-ex on how it would spit back out examples from comp6131
    //   const modifiedNodes = [];
    //   // const notWorking = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];"
    //   nodesOnly.forEach(originalNode => {
    //     console.log('original node in loop', originalNode);
    //     // if (originalNode === notWorking) {
    //     //   console.log('hello');
    //     // }
    //     if ((matchLineNum = lineRegex.exec(originalNode)) !== null) {
    //       const addingFillColour = ", style=filled, fillcolor=\"#87CEFA\"]"
    //       const modifiedString = originalNode.substring(0, originalNode.length - 1) + addingFillColour;
    //       modifiedNodes.push({
    //         original: originalNode,
    //         modified: modifiedString
    //       });
    //       console.log('added fill colour to line');
  
    //     }
    //     else if ((matchLineNum = lnRegex.exec(originalNode)) !== null) {
    //       const addingFillColour = ", style=filled, fillcolor=\"#87CEFA\"];"
    //       const modifiedString = originalNode.substring(0, originalNode.length - 2) + addingFillColour;
    //       modifiedNodes.push({
    //         original: originalNode,
    //         modified: modifiedString
    //       });
    //       console.log('added fill colour to line');
    //     }
    //   });
      

    //   // const exampleString = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];";
      
    //   // if ((matchLineNum = lineRegex.exec(exampleString)) !== null) {
    //   //   console.log('it works for example');
    //   // }
    //   // else if ((matchLineNum = lnRegex.exec(exampleString)) !== null) {
    //   //   console.log('it works for example');
    //   // }  
    //   console.log('modifiedNodes', modifiedNodes);



    // } else {
    //   console.log('No content found within the curly braces.');
    // }


    // const nodes = currentGraph.match(nodePattern) || [];

    // console.log('useEffect test' ,nodes);
    const graphvizContainer = graphRef.current;

    if (currentGraph === 'callgraph.dot' || currentGraph === 'ptacg.dot' || currentGraph === 'tcg.dot') {
      const codeBylines = code.split('\n');
      addFillColorToCallNode(codeBylines);
      console.log('codeBylines', codeBylines);
    } else if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');
      let newlineNumToHighlight: Set<number> = new Set<number>();
      const lineNumToNodes: { [key: string]: { nodes: string[], colour: string } } = {};
      if (svg) {
        const nodes = svg.querySelectorAll('g.node');
        nodes.forEach(node => {
          // getting node Id for debugging purposes. We can remove this later
          const nodeId = node.querySelector('title').textContent;
          
          // Getting all the text in the node. nodeTextList is a list of object 
          const nodeTextList = node.querySelectorAll('text');
          // console.log('nodeTextList', typeof(nodeTextList) ,nodeTextList);
            let nodeTextContentList: string[] = [];
            nodeTextList.forEach((nodeText) => {
              // the actual string content is in the key textContent
              nodeTextContentList.push(nodeText.textContent);
            });
            // Regex for line: [number]
            const lineRegex = /line:\s*(\d+)/g;
            // Regex for ln: [number]
            const lnRegex = /ln:\s*(\d+)/g;

            let matchLineNum;
            // console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

            // check with svf-ex on how it would spit back out examples from comp6131
            nodeTextContentList.forEach(nodeText => {
              // console.log('nodeText in loop', nodeText)
              if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
                const shape = node.querySelector('polygon, ellipse, rect');
                // console.log('shape', shape);
                if (shape) {
                  // console.log('color of the shape', highlightColours[newlineNumToHighlight.size % highlightColours.length]);
                  // shape.setAttribute('fill', 'red');
                  // console.log('shape after', shape);

                }
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                if (matchLineNum[1] in lineNumToNodes) {
                  lineNumToNodes[matchLineNum[1]]['nodes'].push(nodeId);
                } else {
                  const value = {'nodes': [nodeId], colour: ''};
                  lineNumToNodes[matchLineNum[1]] = value;
                }
              
              }
              else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                const shape = node.querySelector('polygon, ellipse, rect');
                // console.log('shape', shape);
                if (shape) {
                  // console.log('color of the shape', highlightColours[newlineNumToHighlight.size % highlightColours.length]);
                  // shape.setAttribute('fill', 'red');
                  // console.log('shape after', shape);
                  if (matchLineNum[1] in lineNumToNodes) {
                    lineNumToNodes[matchLineNum[1]]['nodes'].push(nodeId);
                  } else {
                    const value = {'nodes': [nodeId], colour: ''};
                    lineNumToNodes[matchLineNum[1]] = value;
                  }

                }
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                // console.log('found num: ', parseInt(matchLineNum[1], 10));
              }
            });
            // console.log('newlineNumToHighlight AFTER', newlineNumToHighlight);
            // console.log('nodeTextList', nodeTextList);
            // console.log('nodeTextContentList', nodeTextContentList);
            

          // Perform any operation you want here
        });
        console.log(lineNumToNodes);
        const lineNums = Object.keys(lineNumToNodes);
        const numericKeys = lineNums.map(key => parseInt(key, 10));
        const sortedNumericKeys = numericKeys.sort((a, b) => a - b);
        let nodeIDColour: { [key: string]: string } = {};
        sortedNumericKeys.forEach((lineNum, index) => {
          const colour = highlightColours[index % highlightColours.length];
          lineNumToNodes[lineNum]['colour'] = colour;
          lineNumToNodes[lineNum]['nodes'].forEach(nodeId => {
            nodeIDColour[nodeId] = colour;
          });
        });

        console.log(lineNumToNodes);
        addFillColorToNode(nodeIDColour, graphObj[currentGraph]);
        setLineNumDetails(lineNumToNodes);
        // setlineNumToHighlight(newlineNumToHighlight);
      }
    }
  }, [currentGraph]);

  console.log('graphObj in dotgraphviewer', graphObj);
  // useEffect(() => {
  //   setCurrentGraph(graphObj['callgraph.dot']);
  // }, [graphObj]);

  const addFillColorToCallNode = (codeBylines: string[]) => {
    // const nodePattern = /Node\w+\s*\[\s*shape=record\s*,\s*color=\w+\s*,\s*label="((?:\\.|[^"\\])*)"\s*\];/g;
    // const nodePattern = /Node\w+\s*\[shape=record,\s*[^,]*,\s*label="([^"]*)"\];/g;
    // const nodePattern = /Node[\w\d]+?\s*\[shape=+?,[\s\S]*,\slabel="([^"]*)"\];/g;
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

    // Execute the regex to find a match
    const match = graphContentPattern.exec(graphString);
    console.log('old graphString', graphString);

    if (match) {
      const graphContent = match[1].trim();
      console.log('graphContent' ,graphContent);
      const splitGraphContent = graphContent.split('\n\t');

      // Filter out any empty strings that might occur from the split
      const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
      /* Removing title of the graph
      e.g "label="Call Graph";"
      */
      removedEmptyStrings.shift();


      console.log('non empty parts',removedEmptyStrings);

      /*
      Removing edges from the list
      */
      // const edgePattern = /(\w+)\s+->\s+(\w+)/g;
      // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
      const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;
      const funcs: string[] = [];
      const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));
      console.log('nodesOnly for call nodes', nodesOnly);
      const funcPattern = /fun: ([^\\]+)\\/;
      nodesOnly.forEach(callNode => {
        const match = funcPattern.exec(callNode);
        if (match) {
          const funcString = match[0];
          const removeFun = funcString.replace('fun: ', '');
          /// TODO: Naive approach. Assumes functions are funcName( i.e there are no spaces between funcName and the bracket
          const removeBackSlash = removeFun.replace('\\', '(');
          funcs.push(removeBackSlash);
          console.log('the function string is ' ,funcString);
        } else {
          console.log('No call nodes match match found');
        }
      });
      console.log('funcs', funcs);
      const funcLineColor: {[func: string]: {line: Set<number>, colour: string}} = {};
      const lineNumToNodes: { [key: string]: { nodes: string[], colour: string } } = {};
      const funcToColour: { [func: string]: string } = {};

      codeBylines.forEach((codeLine, index) => {
        funcs.forEach((func) => {
          // Need to account for comments
          if (codeLine.includes(func)) {
            const funcWithSlash = func.replace('(', '\\');
            const funcName = func.replace('(', '');
            if (func in funcLineColor) {
              funcLineColor[func].line.add(index + 1);
              lineNumToNodes[index + 1] = { nodes: [funcName], colour: funcLineColor[func].colour };
            } else {
              let lineNumbers = new Set<number>();
              lineNumbers.add(index + 1);
              const currSizeFunc:number = Object.keys(funcLineColor).length;
              funcLineColor[func] = {line: lineNumbers, colour: highlightColours[currSizeFunc % highlightColours.length]};
              // line num to nodes
              lineNumToNodes[index + 1] = { nodes: [funcName], colour: highlightColours[currSizeFunc % highlightColours.length] };
              funcToColour[funcWithSlash] = highlightColours[currSizeFunc % highlightColours.length];
            }
          }
        });
      });
      
      console.log('funcLineColor', funcLineColor);
      console.log('lineNumToNodes in callgraph', lineNumToNodes);
      addFillColorToNode(funcToColour, graphString);
      setLineNumDetails(lineNumToNodes);



      // let matchLineNum;
      // console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

      // check with svf-ex on how it would spit back out examples from comp6131
      // const modifiedNodes = [];
      // // const notWorking = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];"
      // nodesOnly.forEach(originalNode => {
      //   console.log('original node in loop', originalNode);
      //   // if (originalNode === notWorking) {
      //   //   console.log('hello');
      //   // }
      //   if (originalNode.includes('shape')) {
      //     for (const nodeId:string in nodeIDColour) {
      //       if (originalNode.includes(nodeId)) {
      //         const addingFillColour = `, style=filled, fillcolor="${nodeIDColour[nodeId]}"];`
      //         const modifiedString = originalNode.substring(0, originalNode.length - 2) + addingFillColour;
      //         modifiedNodes.push({
      //           original: originalNode,
      //           modified: modifiedString
      //         });
      //       }
      //     }
      //   }
      //   let newGraphString = graphString;
      //   modifiedNodes.forEach((moddedNode) => {
      //     console.log(moddedNode['original'], ' does substring exists for ',newGraphString.includes(moddedNode['original']));
      //     newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);
      //     console.log(moddedNode['modified'], ' does modified exists for ',newGraphString.includes(moddedNode['modified']));

      //   });
        // if (graphString === newGraphString) {
        //   console.log('no replacement occurred');
        // }
      //   console.log('new graphString', newGraphString);
      //   setGraphString(newGraphString);
      // });
      
      

      // const exampleString = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];";
      
      // if ((matchLineNum = lineRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }
      // else if ((matchLineNum = lnRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }  



    } else {
      console.log('No content found within the curly braces.');
    }
  }

  const addFillColorToNode = (nodeIDColour:{ [key: string]: string }, graphString: string) => {
    // const nodePattern = /Node\w+\s*\[\s*shape=record\s*,\s*color=\w+\s*,\s*label="((?:\\.|[^"\\])*)"\s*\];/g;
    // const nodePattern = /Node\w+\s*\[shape=record,\s*[^,]*,\s*label="([^"]*)"\];/g;
    // const nodePattern = /Node[\w\d]+?\s*\[shape=+?,[\s\S]*,\slabel="([^"]*)"\];/g;
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

    // Execute the regex to find a match
    const match = graphContentPattern.exec(graphString);
    console.log('old graphString', graphString);

    if (match) {
      const graphContent = match[1].trim();
      console.log('graphContent' ,graphContent);
      const splitGraphContent = graphContent.split('\n\t');

      // Filter out any empty strings that might occur from the split
      const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
      /* Removing title of the graph
      e.g "label="Call Graph";"
      */
      removedEmptyStrings.shift();


      console.log('non empty parts',removedEmptyStrings);

      /*
      Removing edges from the list
      */
      // const edgePattern = /(\w+)\s+->\s+(\w+)/g;
      // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
      const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;

      const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));

      // Regex for line: [number]
      const lineRegex = /line:\s*(\d+)/g;
      // Regex for ln: [number]
      const lnRegex = /ln:\s*(\d+)/g;

      let matchLineNum;
      // console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

      // check with svf-ex on how it would spit back out examples from comp6131
      const modifiedNodes = [];
      // const notWorking = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];"
      nodesOnly.forEach(originalNode => {
        console.log('original node in loop', originalNode);
        // if (originalNode === notWorking) {
        //   console.log('hello');
        // }
        if (originalNode.includes('shape')) {
          for (const nodeId:string in nodeIDColour) {
            console.log('nodeId in addFillColorToNode',nodeId);
            if (originalNode.includes(nodeId)) {
              const addingFillColour = `, style=filled, fillcolor="${nodeIDColour[nodeId]}"];`
              const modifiedString = originalNode.substring(0, originalNode.length - 2) + addingFillColour;
              modifiedNodes.push({
                original: originalNode,
                modified: modifiedString
              });
            }
          }
        }
        let newGraphString = graphString;
        modifiedNodes.forEach((moddedNode) => {
          console.log(moddedNode['original'], ' does substring exists for ',newGraphString.includes(moddedNode['original']));
          newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);
          console.log(moddedNode['modified'], ' does modified exists for ',newGraphString.includes(moddedNode['modified']));

        });
        if (graphString === newGraphString) {
          console.log('no replacement occurred');
        }
        console.log('new graphString', newGraphString);
        setGraphString(newGraphString);
      });
      
      

      // const exampleString = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];";
      
      // if ((matchLineNum = lineRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }
      // else if ((matchLineNum = lnRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }  
      console.log('modifiedNodes', modifiedNodes);



    } else {
      console.log('No content found within the curly braces.');
    }
  }

  useEffect(() => {
    if (currCodeLineNum > 0 && currCodeLineNum in lineNumDetails) {
      changeTextColour();
    }
  }, [currCodeLineNum]);

  const changeTextColour = () => {
    // const nodePattern = /Node\w+\s*\[\s*shape=record\s*,\s*color=\w+\s*,\s*label="((?:\\.|[^"\\])*)"\s*\];/g;
    // const nodePattern = /Node\w+\s*\[shape=record,\s*[^,]*,\s*label="([^"]*)"\];/g;
    // const nodePattern = /Node[\w\d]+?\s*\[shape=+?,[\s\S]*,\slabel="([^"]*)"\];/g;
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;
    // Uncomment this if you want a 5 second delay
    // const oldGraphString = graphString;
    let newGraphString = graphString;
    while (newGraphString.includes(', fontcolor=red')) {
      newGraphString = newGraphString.replace(', fontcolor=red', '');
    } 

    // Execute the regex to find a match
    const match = graphContentPattern.exec(graphString);
    console.log('old graphString', graphString);

    if (match) {
      const graphContent = match[1].trim();
      console.log('graphContent' ,graphContent);
      const splitGraphContent = graphContent.split('\n\t');

      // Filter out any empty strings that might occur from the split
      const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
      /* Removing title of the graph
      e.g "label="Call Graph";"
      */
      removedEmptyStrings.shift();


      console.log('non empty parts',removedEmptyStrings);

      /*
      Removing edges from the list
      */
      // const edgePattern = /(\w+)\s+->\s+(\w+)/g;
      // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
      const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;

      const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));

      let matchLineNum;
      // console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

      // check with svf-ex on how it would spit back out examples from comp6131
      const modifiedNodes = [];
      // const notWorking = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];"
      nodesOnly.forEach(originalNode => {
        console.log('original node in loop', originalNode);
        // if (originalNode === notWorking) {
        //   console.log('hello');
        // }
        if (originalNode.includes('shape')) {
          lineNumDetails[currCodeLineNum]['nodes'].forEach(nodeId => {
            if (originalNode.includes(nodeId)) {
              const addingFontColour = ", fontcolor=red];"
              const modifiedString = originalNode.substring(0, originalNode.length - 2) + addingFontColour;
              modifiedNodes.push({
                original: originalNode,
                modified: modifiedString
              });
            }
          });
        }
        modifiedNodes.forEach((moddedNode) => {
          console.log(moddedNode['original'], ' does substring exists for ',newGraphString.includes(moddedNode['original']));
          newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);
          console.log(moddedNode['modified'], ' does modified exists for ',newGraphString.includes(moddedNode['modified']));

        });
        if (graphString !== newGraphString) {
          setGraphString(newGraphString);
        }
        console.log('new graphString', newGraphString);
        
        // If we want to return back to normal after 5 seconds
        // setTimeout(() => {
        //   setGraphString(oldGraphString);
        // }, 5000); // 5000 milliseconds = 5 seconds

      });
      
      

      // const exampleString = "Node0x5cf12bc4a740 [shape=record,color=black,label=\"{NodeID: 7\nIntraBlockNode ID: 7      ret i32 0, !dbg !16 \{ ln: 5  cl: 4  fl: example.c \}    \{fun: main\}}\"];";
      
      // if ((matchLineNum = lineRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }
      // else if ((matchLineNum = lnRegex.exec(exampleString)) !== null) {
      //   console.log('it works for example');
      // }  
      console.log('modifiedNodes', modifiedNodes);



    } else {
      console.log('No content found within the curly braces.');
    }
  }
  const graphBtnClick = (graphKey: string) => {
    console.log('graphKey clicked btn', graphKey);
    if (graphKey !== currentGraph) {
      setGraphString(graphObj[graphKey]);
      setCurrentGraph(graphKey);
    }
  }
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);



  return (
    <>
      {/* {Object.keys(graphObj).length === 0 && graphString !== '' */}
        {/* ? (<p>Press Run</p>) 
        : */}
        {/* ( */}
          <div className="graph-container" >
            <div id="graph-button-container">
            {
              Object.keys(graphObj).map((graphKey) => (
                
                <button 
                  className={`graph-button ${currentGraph === graphKey ? 'selected' : ''}`}  
                  key={graphKey} 
                  onClick={() => graphBtnClick(graphKey)}>
                    {graphKey.replace(/\.dot$/, '')}
                </button>
              ))
            }
            </div>
            
            {/* <div style={{ position: "absolute", }}>
              <button onClick={resetZoom}>Reset</button>
            </div> */}
            <div ref={graphRef} id="graphviz-container">
            {graphString ? (
              <Graphviz
                dot={graphString}
                options={{ 
                  zoom: true, 
                  width: graphWidth,
                  height: graphHeight,
                  useWorker: false,
                  // zoomScaleExtent: [0.5, 2],
                  // zoomTranslateExtent: [[-1000, -1000], [1000, 1000]],
                }}
                // ref={ref}
              />
            ) : (
            <p>No graph to display</p>
          )}
            </div>
            
          </div>
        {/* ) */}
      {/* // } */}
    </>
  );
}

export default DotGraphViewer
