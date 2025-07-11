import React, { useCallback, useRef, useEffect, useState } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";
import './dotGraphViewer.css';

interface DotGraphViewerProps {
  lineNumToHighlight: Set<number>;
  setlineNumToHighlight: (newLineNumToHighlight: Set<number>) => void;
  graphObj: { [key: string]: string };
  lineNumDetails: { [lineNum: string]: { nodeOrllvm: string[], colour: string } };
  setLineNumDetails: (newLineNumDetails: { [lineNum: string]: { nodeOrllvm: string[], colour: string } }) => void;
  currCodeLineNum: number;
  code: string;


}

// These are the colours that will be used for the background of the nodes and highlight colour for the code editor
const highlightColours = ['#D9F0E9', '#FFFFE3', '#E9E8F1', '#FFD6D2', '#D4E5EE', '#D5E4EF', '#FFE5C9', '#E5F4CD', '#F2F2F0', '#E9D6E7', '#EDF8EA', '#FFF8CF'];

const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  lineNumToHighlight,
  setlineNumToHighlight,
  graphObj,
  lineNumDetails,
  setLineNumDetails,
  currCodeLineNum,
  code,
}) => {

  /*  currentGraph holds the name of the current graph
      e.g currentGraph = 'callgraph.dot' or currentGraph = 'vfg.dot'
      it also holds the current key of the graphObj
  */
  const [currentGraph, setCurrentGraph] = useState('');
  
  /*
    graphString is the digraph string which graphviz will use to render the graph
    The string is the value of the key in graphObj
    e.g graphString = `digraph "callgraph" { ... }`
  */
  const [graphString, setGraphString] = useState('');

  useEffect(() => {
    // Check if "pag" exists in graphObj, otherwise use the first graph as default
    if (Object.keys(graphObj).length > 0 && !currentGraph) {
      const defaultGraphKey = graphObj['pag'] ? 'pag' : Object.keys(graphObj)[0];
      setCurrentGraph(defaultGraphKey);
      setGraphString(graphObj[defaultGraphKey]);
    }
  }, [graphObj]); // This will run when graphObj is updated
  
  // Used to set the width and height of the DotGraphViewer
  const graphWidth = window.innerWidth * 0.5;
  const graphHeight = window.innerHeight * 0.85;
  
  const graphRef = useRef(null);

  /*
    The use effect below is used to add an event listener to each node in the graph
    The event listener is used to trigger an event when a node is clicked on.
    Even though an event listener is added to every node. An event only occurs for nodes that have a line number in them.
    If the graph is a call graph. Then all nodes can trigger an event.
    The event is: When a node is clicked, the line numbers of the code that the node represents will be highlighted
  */
  useEffect(() => {
    const graphvizContainer = graphRef.current;

    if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');
      console.log('svg', svg);
      if (svg) {
        // The if condition adds the event listners to nodes in call graphs
        if (currentGraph === 'callgraph.dot' || currentGraph === 'ptacg.dot' || currentGraph === 'tcg.dot') {
          svg.addEventListener('click', (event) => {
            const node = event.target.closest('g.node');
            if (node) {
              const nodeTextList = node.querySelectorAll('text');                
              let nodeTextContentList: string[] = [];
              nodeTextList.forEach((nodeText) => {
                nodeTextContentList.push(nodeText.textContent);
              });
              const funcPattern = /fun:\s*([^\}]+)/;
              // Finds the first function name then breaks
              let funcTofind = '';
              for (const callNodeText of nodeTextContentList) {
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
                const nodes = lineNumDetails[lineNum].nodeOrllvm;
                if (nodes.includes(funcTofind)) {
                  newlineNumToHighlight.add(parseInt(lineNum, 10));
                }
              });
              setlineNumToHighlight(newlineNumToHighlight);
            }              
          });
        // Here we add event listeners to other types of graphs
        } else {
          svg.addEventListener('click', (event) => {
            const node = event.target.closest('g.node');
            if (node) {
              console.log('node', node);
              const nodeTextList = node.querySelectorAll('text');
              let nodeTextContentList: string[] = [];
              nodeTextList.forEach((nodeText) => {
                nodeTextContentList.push(nodeText.textContent);
              });
              /*
               These are the line regexes used to detect if node has a line number
              */
              const lineRegex = /line:\s*(\d+)/g;
              const lnRegex = /ln:\s*(\d+)/g;
              const lnJsonRegex = /ln":\s*(\d+)/g;
              const lineJsonRegex = /line":\s*(\d+)/g;

              let matchLineNum;
              let newlineNumToHighlight: Set<number> = new Set<number>();

              // check with svf-ex on how it would spit back out examples from comp6131
              nodeTextContentList.forEach(nodeText => {
                if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                }
                else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                }
                else if ((matchLineNum = lnJsonRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                } else if ((matchLineNum = lineJsonRegex.exec(nodeText)) !== null) {
                  newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                } 
              });

              setlineNumToHighlight(newlineNumToHighlight);
            }
          });
        }
          
      }
        
    }
  }, [graphString]);

  /*
    The useEffect adds background colour to the nodes
  */
  useEffect(() => {
    const graphvizContainer = graphRef.current;
    if (currentGraph === 'callgraph.dot' || currentGraph === 'ptacg.dot' || currentGraph === 'tcg.dot') {
      const codeBylines = code.split('\n');
      addFillColorToCallNode(codeBylines);
    } else if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');
      let newlineNumToHighlight: Set<number> = new Set<number>();
      const lineNumToNodes: { [key: string]: { nodeOrllvm: string[], colour: string } } = {};
      if (svg) {
        const nodes = svg.querySelectorAll('g.node');
        nodes.forEach(node => {
          const nodeId = node.querySelector('title').textContent;
        
          // Getting all the text in the node. nodeTextList is a list of object 
          const nodeTextList = node.querySelectorAll('text');
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

            // check with svf-ex on how it would spit back out examples from comp6131
            nodeTextContentList.forEach(nodeText => {
              if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {                
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                if (matchLineNum[1] in lineNumToNodes) {
                  lineNumToNodes[matchLineNum[1]]['nodeOrllvm'].push(nodeId);
                } else {
                  const value = {'nodeOrllvm': [nodeId], colour: ''};
                  lineNumToNodes[matchLineNum[1]] = value;
                }
              
              }
              else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                const shape = node.querySelector('polygon, ellipse, rect');
                if (shape) {
                  if (matchLineNum[1] in lineNumToNodes) {
                    lineNumToNodes[matchLineNum[1]]['nodeOrllvm'].push(nodeId);
                  } else {
                    const value = {'nodeOrllvm': [nodeId], colour: ''};
                    lineNumToNodes[matchLineNum[1]] = value;
                  }

                }
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
              }
            });          
        });
        const lineNums = Object.keys(lineNumToNodes);
        const numericKeys = lineNums.map(key => parseInt(key, 10));
        const sortedNumericKeys = numericKeys.sort((a, b) => a - b);
        let nodeIDColour: { [key: string]: string } = {};
        sortedNumericKeys.forEach((lineNum, index) => {
          const colour = highlightColours[index % highlightColours.length];
          lineNumToNodes[lineNum]['colour'] = colour;
          lineNumToNodes[lineNum]['nodeOrllvm'].forEach(nodeId => {
            nodeIDColour[nodeId] = colour;
          });
        });

        addFillColorToNode(nodeIDColour, graphObj[currentGraph]);
        setLineNumDetails(lineNumToNodes);
      }
    }
  }, [currentGraph]);

  /* Function used to add background color to call nodes */
  const addFillColorToCallNode = (codeBylines: string[]) => {
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

    // Execute the regex to find a match
    const match = graphContentPattern.exec(graphString);
    if (match) {
      const graphContent = match[1].trim();
      const splitGraphContent = graphContent.split('\n\t');

      // Filter out any empty strings that might occur from the split
      const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
      /* Removing title of the graph
      e.g "label="Call Graph";"
      */
      removedEmptyStrings.shift();

      /*
      Removing edges from the list
      */
      // const edgePattern = /(\w+)\s+->\s+(\w+)/g;
      // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
      const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;
      const funcs: string[] = [];
      const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));
      const funcPattern = /fun: ([^\\]+)\\/;
      nodesOnly.forEach(callNode => {
        const match = funcPattern.exec(callNode);
        if (match) {
          const funcString = match[0];
          const removeFun = funcString.replace('fun: ', '');
          /// TODO: Naive approach. Assumes functions are funcName( i.e there are no spaces between funcName and the bracket
          const removeBackSlash = removeFun.replace('\\', '(');
          funcs.push(removeBackSlash);
        }
      });
      const funcLineColor: {[func: string]: {line: Set<number>, colour: string}} = {};
      const lineNumToNodes: { [key: string]: { nodeOrllvm: string[], colour: string } } = {};
      const funcToColour: { [func: string]: string } = {};

      codeBylines.forEach((codeLine, index) => {
        funcs.forEach((func) => {
          // Need to account for comments
          if (codeLine.includes(func)) {
            const funcWithSlash = func.replace('(', '\\');
            const funcName = func.replace('(', '');
            if (func in funcLineColor) {
              funcLineColor[func].line.add(index + 1);
              lineNumToNodes[index + 1] = { nodeOrllvm: [funcName], colour: funcLineColor[func].colour };
            } else {
              let lineNumbers = new Set<number>();
              lineNumbers.add(index + 1);
              const currSizeFunc:number = Object.keys(funcLineColor).length;
              funcLineColor[func] = {line: lineNumbers, colour: highlightColours[currSizeFunc % highlightColours.length]};
              // line num to nodes
              lineNumToNodes[index + 1] = { nodeOrllvm: [funcName], colour: highlightColours[currSizeFunc % highlightColours.length] };
              funcToColour[funcWithSlash] = highlightColours[currSizeFunc % highlightColours.length];
            }
          }
        });
      });
      addFillColorToNode(funcToColour, graphString);
      setLineNumDetails(lineNumToNodes);
    } 
  }

  /* Adds fill colour to nodes by manipulating the dotgraph string
    adds the following: style=filled, fillcolor="${nodeIDColour[nodeId]}" to nodes with corresponding line graph
  */
  const addFillColorToNode = (nodeIDColour:{ [key: string]: string }, graphString: string) => {
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

    // Execute the regex to find a match
    // Checks if the graphString is a digraph
    const match = graphContentPattern.exec(graphString);

    if (match) {
     const nodesOnly = getNodes(match);

      // check with svf-ex on how it would spit back out examples from comp6131
      const modifiedNodes = [];
      nodesOnly.forEach(originalNode => {
        if (originalNode.includes('shape')) {
          for (const nodeId in nodeIDColour) {
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
          newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);

        });
        setGraphString(newGraphString);
      });
    }
  }

  const getNodes = (matchedDigraph: RegExpExecArray) => {
    const graphContent = matchedDigraph[1].trim();
      const splitGraphContent = graphContent.split('\n\t');

      // Filter out any empty strings that might occur from the split
      const removedEmptyStrings = splitGraphContent.filter(part => part.trim() !== '');
      
      /* Removing title of the graph
      e.g "label="Call Graph";"
      */
      removedEmptyStrings.shift();

      /*
      Removing edges from the list
      */
      // Removes most edges, sometimes leaves some edges which can be seen in icfg.dot
      const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;
      const nodesOnly = removedEmptyStrings.filter(item => !edgePattern.test(item));
      return nodesOnly;
  }

  useEffect(() => {
    if (currCodeLineNum > 0 && currCodeLineNum in lineNumDetails) {
      changeTextColour();
    }
  }, [currCodeLineNum]);

  const changeTextColour = () => {
    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;
    
    /*
      This is used to remove the red font colour from the nodes from previous selections
      Essentially a reset
    */
    let newGraphString = graphString;
    while (newGraphString.includes(', fontcolor=red')) {
      newGraphString = newGraphString.replace(', fontcolor=red', '');
    } 

    // Execute the regex to find a match
    const match = graphContentPattern.exec(graphString);

    if (match) {
      const nodesOnly = getNodes(match);
      const modifiedNodes = [];
      nodesOnly.forEach(originalNode => {
        if (originalNode.includes('shape')) {
          lineNumDetails[currCodeLineNum]['nodeOrllvm'].forEach(nodeId => {
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
          newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);
        });
        if (graphString !== newGraphString) {
          setGraphString(newGraphString);
        }
      });
    }
  }

  const graphBtnClick = (graphKey: string) => {
    if (graphKey !== currentGraph) {
      setGraphString(graphObj[graphKey]);
      setCurrentGraph(graphKey);
    }
  }

  // Keep a reference of the graphviz component to be able to use its built in functions such as resetZoom
  const graphvizInstance = useRef(null);

  const resetZoom = useCallback(() => {
    if (graphvizInstance.current) {
      graphvizInstance.current.resetZoom();
    }
  }, [graphvizInstance]);

  useEffect(() => {
    if (graphRef.current) {
      graphvizInstance.current = graphviz(graphRef.current)
        .height(graphHeight)
        .width(graphWidth)
        .zoom(true)
        .renderDot(graphString);
    }
  }, [graphString]);

  // Zoom to node work in progreess
  // Can zoom to node but zoom needs work
  // Graphs could appear in different sizes making it hard
  // const [nodeIDList, setNodeIDList] = useState([]);
  // const [nodeIDIndex, setNodeIDIndex] = useState(0);

  // const zoomToNode = useCallback((nodeTitle : string) => {
  //   console.log('zoomToNOde called and nodeID is ', nodeTitle);
  //   if (graphRef.current) {
  //     console.log('graphRef check good');
  //     const svg = d3.select(graphRef.current).select('svg');
  //     console.log('svg is ', svg);
  //     const node = svg.selectAll('g.node').filter(function() {
  //       return d3.select(this).select('title').text() === nodeTitle;
  //     });      if (!node.empty()) {
  //       console.log('we found the node')
  //       d3.zoomTransform(svg.node() as Element).rescaleX(d3.scaleLinear().domain([0, graphWidth])).range([0, graphWidth]).domain([0, graphHeight]).range([0, graphHeight]);
  //       const nodeElement = node.node() as SVGGraphicsElement;
  //       console.log('nodeElement is ', nodeElement)
  //       const nodeBox = nodeElement.getBBox();
  //       const nodeCenterX = (nodeBox.x + nodeBox.width / 2);
  //       const nodeCenterY = (nodeBox.y + nodeBox.height / 2);
  //       const zoomBehavior = d3.zoom().on('zoom', null); // Remove existing zoom behavior
  //       svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(graphWidth / 2 - nodeCenterX, graphHeight / 2 - nodeCenterY).scale(1));
  //     } else {
  //       console.log('did not find node')
  //     }
  //   }
  // }, [graphWidth, graphHeight]);

  // const handleZoomToNode = (newNodeIDIndex: number) => {
  //   if (newNodeIDIndex < 0) {
  //     newNodeIDIndex = nodeIDList.length
  //   } else if (newNodeIDIndex > nodeIDList.length) {
  //     newNodeIDIndex = 0;
  //   }
  //   setNodeIDIndex(newNodeIDIndex);
  //   zoomToNode(nodeIDList[newNodeIDIndex].title);
  // }

  return (
    <>
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
        <div id='graph-container'>
          <div id='graphcontainer-menu-bar'>
            <button onClick={resetZoom}>Reset Zoom</button>
          </div>
          <div ref={graphRef} id="graphviz-container">
            {graphString ? (
              <Graphviz
                dot={graphString}
                options={{ 
                  zoom: true, 
                  width: graphWidth,
                  height: graphHeight,
                  useWorker: false,
                }}
              />
            ) : (
              <p>No graph to display</p>
            )}
          </div>
          
        </div>
        
        
      </div>
    </>
  );
}

export default DotGraphViewer
