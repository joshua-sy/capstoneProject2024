import React from 'react';

import Select, { MultiValue, ActionMeta } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface executableOption {
  value: string;
  label: string;
}

interface ExecutableOptionsMenuProps {
  executableOptions: executableOption[];
  setSelectedExecutableOptions: (selectedExecutableOptions: executableOption[]) => void;
  selectedExecutableOptions: executableOption[];

}

const options = [
  { value: 'mta', label: 'mta' },
  { value: 'saber', label: 'saber' },
  { value: 'ae', label: 'ae' },
]

const ExecutableOptionsMenu: React.FC<ExecutableOptionsMenuProps> = ({
  executableOptions,
  setSelectedExecutableOptions,
  selectedExecutableOptions
}) =>
{
  const handleChange = (selected: MultiValue<executableOption>, _actionMeta: ActionMeta<executableOption>) => {
    const selectedExecutableOptionsArray = selected as executableOption[];
    console.log(typeof selectedExecutableOptionsArray)
    setSelectedExecutableOptions(selectedExecutableOptionsArray);
  }
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[executableOptions[0], executableOptions[1], executableOptions[2]]}
      isMulti
      options={executableOptions}
      value={selectedExecutableOptions}
      onChange={handleChange}
    />
  );
}
export default ExecutableOptionsMenu
