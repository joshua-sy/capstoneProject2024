import React from 'react';
import './SubmitCodeBar.css';
import CompileOptionsMenu from '../compileOptionsMenu/compileOptionsMenu';

interface CompileOption {
  value: string;
  label: string;
}


interface SubmitCodeBarProps {
  submitEvent: () => void;
  resetCompileOptions: () => void;
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];
}

const SubmitCodeBar: React.FC<SubmitCodeBarProps> = ({
  submitEvent,
  resetCompileOptions,
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions,
}) => {
  return (
    <>
      <div className='submitCodeBarContainer'>
        <CompileOptionsMenu compileOptions={compileOptions} setSelectedCompileOptions={setSelectedCompileOptions} selectedCompileOptions={selectedCompileOptions}/>
        <button className='run-button' onClick={submitEvent}>Run</button>
        <button className='reset-button' onClick={resetCompileOptions}>Reset Default</button>
      </div>

    </>
  )
}

export default SubmitCodeBar
