import React from 'react';
import './SubmitCodeBar.css';
import CompileOptionsMenu from '../compileOptionsMenu/compileOptionsMenu';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


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
      <div id='submit-codeBar-container'>
        <div id='submit-codeBar-compile-options-container'>
          <h4>Enter your compile options: </h4>
          <CompileOptionsMenu compileOptions={compileOptions} setSelectedCompileOptions={setSelectedCompileOptions} selectedCompileOptions={selectedCompileOptions}/>
        </div>
       <div id='submit-code-bar-button-container'>
          <div>
            <button className='reset-button' onClick={resetCompileOptions}>Reset Default</button> 
          </div>
          <div>
            <button className='run-button' onClick={submitEvent}>Run</button>
          </div>
       </div>

        

        {/* <div id='submit-code-bar-button-container'>
          {/* <div id='submit-code-bar-button-container'>
            <span id='submit-code-bar-reset-btn-container'>
              <Button size='small' variant="contained" onClick={resetCompileOptions} endIcon={<RestartAltIcon />}>
                Reset Default
              </Button>
            </span>
            <span id='submit-code-bar-run-btn-container'>
              <Button size='small' variant="contained" onClick={submitEvent} endIcon={<PlayArrowIcon />}>
                Run
              </Button>
            </span>
          </div> */}
          
        {/* </div> */}
        
        
      </div>

    </>
  )
}

export default SubmitCodeBar
