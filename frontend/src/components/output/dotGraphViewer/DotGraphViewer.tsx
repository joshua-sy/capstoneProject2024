import React, { useCallback, useRef } from "react";
import { graphviz } from "d3-graphviz";
import { Graphviz } from "graphviz-react";

interface DotGraphViewerProps {
  dotGraphString: string;
}
const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  dotGraphString,
}) => {
  
  const ref = useRef(null);

  const reset = useCallback(() => {
    if (ref.current) {
      const { id } = ref.current;
      graphviz(`#${id}`).resetZoom();
    }
  }, [ref]);
  
  return (
    <>
      <div>
        <div style={{ position: "absolute", }}>
          <button onClick={reset}>Reset</button>
        </div>
        <Graphviz
          dot={dotGraphString}
          options={{ zoom: true, width: window.innerWidth, useWorker: false }}
          // ref={ref}
        />
      </div>
     
    </>
  );
}

export default DotGraphViewer
