import { useCallback, useRef } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";



function DotGraphViewer() {
  const data = `digraph "Call Graph" {
    label="Call Graph";
  
    Node0x55fc43c981a0 [shape=record,shape=Mrecord,label="{CallGraphNode ID: 1 \\{fun: printf\\}}"];
    Node0x55fc43c98620 [shape=record,shape=box,label="{CallGraphNode ID: 0 \\{fun: main\\}|{<s0>1}}"];
    Node0x55fc43c98620:s0 -> Node0x55fc43c981a0[color=black];
  }`;
  const ref = useRef(null);

  const reset = useCallback(() => {
    if (ref.current) {
      const { id } = ref.current;
      graphviz(`#${id}`).resetZoom();
    }
  }, [ref]);
  
  return (
    <>
      <div style={{width: '50%'}}>
        <div style={{ position: "absolute", }}>
          <button onClick={reset}>Reset</button>
        </div>
        <Graphviz
          dot={data}
          options={{ zoom: true, width: window.innerWidth, useWorker: false }}
          // ref={ref}
        />
      </div>
     
    </>
  );
}

export default DotGraphViewer
