import React, {useState} from 'react';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import './styles.css';


const FontSizeMenu = ({fontSize, setFontSize}: {fontSize: number, setFontSize: () => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allowedFontSizes = () => {
    let allowedFontSizesList = []
    for (let i = 8; i < 31; i ++) {
      allowedFontSizesList.push(i);
    }
    return allowedFontSizesList
  }
  const handleFontSizeDropDown = () => {
    setIsOpen(!isOpen);
  }
  console.log('font size is ', fontSize)

  return (
    <div id='font-size-menu-container'>
      <div id='font-size-drop-down-container'>
        <button id='font-size-dropdown-btn' onClick={handleFontSizeDropDown}>
          {fontSize}
        </button>
        {isOpen && (
          <div id="font-size-dropdown-menu">
            {allowedFontSizes().map((fontSizeNum) => (
              <div className='font-size-drop-menu-item'>{fontSizeNum}</div>
            ))}

          </div>
        )}
      </div>
      
      <div className='submit-codeBar-font-size-button-div'>
              <TextDecreaseIcon fontSize='small'/>
            </div>
            <div className='submit-codeBar-font-size-button-div'>
              <TextIncreaseIcon fontSize='small'/>
            </div>
    </div>
  )
};
export default FontSizeMenu;