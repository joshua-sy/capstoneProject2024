import React, { useCallback, useRef, useEffect, useState } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";
import styles from './dotGraphViewer.module.css';



interface DotGraphViewerProps {
  dotGraphString: string;
  lineNumToHighlight: number[];
  setlineNumToHighlight: (newLineNumToHighlight: number[]) => void
}
const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  dotGraphString,
  lineNumToHighlight,
  setlineNumToHighlight,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const data = `digraph "Call Graph" {
    label="Call Graph";
  
    Node0x55fc43c981a0 [shape=record,shape=Mrecord,label="{CallGraphNode ID: 1 \\{fun: printf\\}}"];
    Node0x55fc43c98620 [shape=record,shape=box,label="{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}"];
    Node0x55fc43c98620:s0 -> Node0x55fc43c981a0[color=black];
  }`;
  const graphRef = useRef(null);

  const reset = useCallback(() => {
    if (graphRef.current) {
      const { id } = graphRef.current;
      graphviz(`#${id}`).resetZoom();
    }
  }, [graphRef]);

  // add an event listener to each node so an event triggers when i click on it 
  useEffect(() => {
    const graphvizContainer = graphRef.current;

    if (graphvizContainer) {
      const svg = graphvizContainer.querySelector('svg');

      if (svg) {
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
            const lineRegex = /line*:*(\d+)/g;
            const lnRegex = /ln*:*(\d+)/g;
            const lnJsonRegex = /ln":\s*(\d+)/g;
            const lineJsonRegex = /line":\s*(\d+)/g;

            let matchLineNum;
            let newlineNumToHighlight: number[] = [... lineNumToHighlight];
            // check with svf-ex on how it would spit back out examples from comp6131
            nodeTextContentList.forEach(nodeText => {
              console.log('nodeText in loop', nodeText)
              if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
                newlineNumToHighlight.push(parseInt(matchLineNum[1], 10));
              }
              else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
                newlineNumToHighlight.push(parseInt(matchLineNum[1], 10));
                console.log('found num: ', parseInt(matchLineNum[1], 10));
              }
              else if ((matchLineNum = lnJsonRegex.exec(nodeText)) !== null) {
                newlineNumToHighlight.push(parseInt(matchLineNum[1], 10));
                console.log('found num: ', parseInt(matchLineNum[1], 10));
              } else if ((matchLineNum = lineJsonRegex.exec(nodeText)) !== null) {
                newlineNumToHighlight.push(parseInt(matchLineNum[1], 10));
                console.log('found num: ', parseInt(matchLineNum[1], 10));
              } 
            });
            console.log('lineNumToHighlight', lineNumToHighlight);

            console.log('nodeTextList', nodeTextList);
            console.log('nodeTextContentList', nodeTextContentList);
            setlineNumToHighlight(newlineNumToHighlight);
            setSelectedNode(nodeId);

          }
        });
      }
    }
  }, [dotGraphString]);
  return (
    <>
      <div style={{width: '50%'}}>
        <div style={{ position: "absolute", }}>
          <button onClick={reset}>Reset</button>
        </div>
        <div ref={graphRef} id="graphviz-container">
        <Graphviz
          dot={dotGraphString}
          options={{ zoom: true, width: window.innerWidth, useWorker: false }}
          // ref={ref}
        />
        </div>
       
        {selectedNode && <p>Selected Node: {selectedNode}</p>};

      </div>
     
    </>
  );
}

export default DotGraphViewer
