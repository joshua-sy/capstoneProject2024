import React from 'react';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/dotGraphViewer/DotGraphViewer';

function GraphsPage() {
  const inlineStyles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',      
    },
  };
  return (
    <>
      <div>GraphPage</div>
      <div style={inlineStyles.container}>
        <CodeEditor />
        <DotGraphViewer />
      </div>

    </>
  )
}

export default GraphsPage
