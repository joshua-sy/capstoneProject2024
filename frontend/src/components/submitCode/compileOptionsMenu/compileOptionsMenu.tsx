import React from 'react';

import Select, { MultiValue, ActionMeta } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface CompileOption {
  value: string;
  label: string;
}

interface CompileOptionsMenuProps {
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];

}

const options = [
  { value: '-g', label: '-g' },
  { value: '-c', label: '-c' },
  { value: '-S', label: '-S' },
  { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
  { value: '-emit-llvm', label: '-emit-llvm' },
  { value: '-pass-exit-codes', label: '-pass-exit-codes' },
  { value: '-E', label: '-E' },
  { value: '-v', label: '-v' },
  { value: '-pipe', label: '-pipe' },
  { value: '--help', label: '--help' },
  { value: '-fcanon-prefix-map', label: '-fcanon-prefix-map' },

]

const CompileOptionsMenu: React.FC<CompileOptionsMenuProps> = ({
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions
}) =>
{
  const handleChange = (selected: MultiValue<CompileOption>, _actionMeta: ActionMeta<CompileOption>) => {
    const selectedCompileOptionsArray = selected as CompileOption[];
    console.log(typeof selectedCompileOptionsArray)
    setSelectedCompileOptions(selectedCompileOptionsArray);
  }
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]}
      isMulti
      options={compileOptions}
      value={selectedCompileOptions}
      onChange={handleChange}
    />
  );
}
export default CompileOptionsMenu
