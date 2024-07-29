import React, { useCallback, useRef, useEffect, useState } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";
import styles from './dotGraphViewer.module.css';



interface DotGraphViewerProps {
  dotGraphString: string;
  lineNumToHighlight: Set<number>;
  setlineNumToHighlight: (newLineNumToHighlight: Set<number>) => void;
  graphObj: { [key: string]: string };


}

const highlightColours = ['#D9F0E9', '#FFFFE3', '#E9E8F1', '#FFD6D2', '#D4E5EE', '#D5E4EF', '#FFE5C9', '#E5F4CD', '#F2F2F0', '#E9D6E7', '#EDF8EA', '#FFF8CF'];

const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  dotGraphString,
  lineNumToHighlight,
  setlineNumToHighlight,
  graphObj
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const data = `digraph "Call Graph" {
    label="Call Graph";
  
    Node0x55fc43c981a0 [shape=record,shape=Mrecord,label="{CallGraphNode ID: 1 \\{fun: printf\\}}"];
    Node0x55fc43c98620 [shape=record,shape=box,label="{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}"];
    Node0x55fc43c98620:s0 -> Node0x55fc43c981a0[color=black];
  }`;
  const [currentGraph, setCurrentGraph] = useState(data);

  
  const graphRef = useRef(null);

  const reset = useCallback(() => {
    if (graphRef.current) {
      const { id } = graphRef.current;
      graphviz(`#${id}`).resetZoom();
    }
  }, [graphRef]);

  // add an event listener to each node so an event triggers when i click on it 
  // useEffect(() => {
  //   const graphvizContainer = graphRef.current;

  //   if (graphvizContainer) {
  //     const svg = graphvizContainer.querySelector('svg');
  //     console.log('svg', svg);
  //     if (svg) {
  //       svg.addEventListener('click', (event) => {
  //         const node = event.target.closest('g.node');
  //         if (node) {
  //           console.log('node', node);
  //           const nodeId = node.querySelector('title').textContent;
  //           // const nodeText = node.querySelector('text').textContent;
  //           const nodeTextList = node.querySelectorAll('text');
  //           // const nodeTextListContent = nodeTextList.map((node) => {
              
  //           // })
  //           let nodeTextContentList: string[] = [];
  //           nodeTextList.forEach((nodeText) => {
  //             nodeTextContentList.push(nodeText.textContent);
  //           });
  //           // const lineRegex = /line*:*(\d+)/g;
  //           const lineRegex = /line:\s*(\d+)/g;

  //           // const lnRegex = /ln*:*(\d+)/g;
  //           const lnRegex = /ln:\s*(\d+)/g;

  //           const lnJsonRegex = /ln":\s*(\d+)/g;
  //           const lineJsonRegex = /line":\s*(\d+)/g;

  //           let matchLineNum;
  //           console.log('lineNumToHighlight',lineNumToHighlight);
  //           let newlineNumToHighlight: Set<number> = new Set<number>([...lineNumToHighlight]);;
  //           console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

  //           // check with svf-ex on how it would spit back out examples from comp6131
  //           nodeTextContentList.forEach(nodeText => {
  //             console.log('nodeText in loop', nodeText)
  //             if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
  //               newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
  //             }
  //             else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
  //               newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
  //               console.log('found num: ', parseInt(matchLineNum[1], 10));
  //             }
  //             else if ((matchLineNum = lnJsonRegex.exec(nodeText)) !== null) {
  //               newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
  //               console.log('found num: ', parseInt(matchLineNum[1], 10));
  //             } else if ((matchLineNum = lineJsonRegex.exec(nodeText)) !== null) {
  //               newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
  //               console.log('found num: ', parseInt(matchLineNum[1], 10));
  //             } 
  //           });
  //           console.log('newlineNumToHighlight AFTER', newlineNumToHighlight);
  //           console.log('nodeTextList', nodeTextList);
  //           console.log('nodeTextContentList', nodeTextContentList);
  //           setlineNumToHighlight(newlineNumToHighlight);
  //           setSelectedNode(nodeId);

  //         }
  //       });
  //     }
  //   }
  // }, [currentGraph]);
  useEffect(() => {
    const graphvizContainer = graphRef.current;
    
    if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');
      let newlineNumToHighlight: Set<number> = new Set<number>();
      if (svg) {
        const nodes = svg.querySelectorAll('g.node');
        nodes.forEach(node => {
          // getting node Id for debugging purposes. We can remove this later
          const nodeId = node.querySelector('title').textContent;
          
          // Getting all the text in the node. nodeTextList is a list of object 
          const nodeTextList = node.querySelectorAll('text');
          console.log('nodeTextList', typeof(nodeTextList) ,nodeTextList);
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
            console.log('newlineNumToHighlight BEFORE', newlineNumToHighlight);

            // check with svf-ex on how it would spit back out examples from comp6131
            nodeTextContentList.forEach(nodeText => {
              console.log('nodeText in loop', nodeText)
              if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
                const shape = node.querySelector('polygon, ellipse, rect');
                console.log('shape', shape);
                if (shape) {
                  console.log('color of the shape', highlightColours[newlineNumToHighlight.size % highlightColours.length]);
                  shape.setAttribute('fill', 'red');
                  console.log('shape after', shape);

                }
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
              
              }
              else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                const shape = node.querySelector('polygon, ellipse, rect');
                console.log('shape', shape);
                if (shape) {
                  console.log('color of the shape', highlightColours[newlineNumToHighlight.size % highlightColours.length]);
                  shape.setAttribute('fill', 'red');
                  console.log('shape after', shape);

                }
                newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
                // console.log('found num: ', parseInt(matchLineNum[1], 10));
              }
            });
            console.log('newlineNumToHighlight AFTER', newlineNumToHighlight);
            console.log('nodeTextList', nodeTextList);
            console.log('nodeTextContentList', nodeTextContentList);
            

          // Perform any operation you want here
        });
        setlineNumToHighlight(newlineNumToHighlight);
            // setSelectedNode(nodeId);
      }
    }
  }, [currentGraph]);

  console.log('graphObj in dotgraphviewer', graphObj);
  // useEffect(() => {
  //   setCurrentGraph(graphObj['callgraph.dot']);
  // }, [graphObj]);
  const graphBtnClick = (graphKey: string) => {
    console.log('graphKey clicked btn', graphKey);
    setCurrentGraph(graphObj[graphKey]);
  }

  return (
    <>
      {Object.keys(graphObj).length === 0 
        ? (<p>Press Run</p>) 
        :
          (
            <div style={{width: '50%'}}>
              <div style={{ position: "absolute", }}>
                <button onClick={reset}>Reset</button>
              </div>
              <div ref={graphRef} id="graphviz-container">
              <Graphviz
                dot={currentGraph}
                options={{ zoom: true, width: window.innerWidth, useWorker: false }}
                // ref={ref}
              />
              </div>
              {
                Object.keys(graphObj).map((graphKey) => (
                  
                  <button key={graphKey} onClick={() => graphBtnClick(graphKey)}>{graphKey.replace(/\.dot$/, '')}</button>
                ))
              }
              {selectedNode && <p>Selected Node: {selectedNode}</p>};
            </div>
        )
      }
    </>
  );
}

export default DotGraphViewer
