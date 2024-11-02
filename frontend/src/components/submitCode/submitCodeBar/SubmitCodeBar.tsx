import React from 'react';
import './SubmitCodeBar.css';
import CompileOptionsMenu from '../compileOptionsMenu/compileOptionsMenu';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExecutableOptionsMenu from '../executablesOptionsMenu/executablesOptionsMenu';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';


interface CompileOption {
  value: string;
  label: string;
}

interface executableOption {
  value: string;
  label: string;
}


interface SubmitCodeBarProps {
  submitEvent: () => void;
  resetCompileOptions: () => void;
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];
  setSelectedExecutableOptions: (selectedCompileOptions: executableOption[]) => void;
  selectedExecutableOptions: executableOption[];
  executableOptions: executableOption[];
}

const SubmitCodeBar: React.FC<SubmitCodeBarProps> = ({
  submitEvent,
  resetCompileOptions,
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions,
  setSelectedExecutableOptions,
  selectedExecutableOptions,
  executableOptions,

}) => {
  return (
    <>
      <div id='submit-codeBar-container'>
        <div id='submit-codeBar-compile-options-container'>
          <h5>Enter your compile options: </h5>
          <CompileOptionsMenu compileOptions={compileOptions} setSelectedCompileOptions={setSelectedCompileOptions} selectedCompileOptions={selectedCompileOptions}/>
          <h5>Select executable options: </h5>
          <ExecutableOptionsMenu setSelectedExecutableOptions={setSelectedExecutableOptions} selectedExecutableOptions={selectedExecutableOptions} executableOptions={executableOptions}/>
        </div>
       <div id='submit-code-bar-button-container'>
          <div>
            <Button size='small' variant='contained' color='secondary' onClick={resetCompileOptions} startIcon={<RestartAltIcon />}>
              Reset
            </Button>
          </div>
          <div>
            <Button size='small'  variant='contained' onClick={submitEvent} startIcon={<PlayArrowIcon />}>
              Run
            </Button>
          </div>
       </div>
      </div>

    </>
  )
}

export default SubmitCodeBar
