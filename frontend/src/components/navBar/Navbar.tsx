import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './navbar.css';
import svfLogo from '../../assets/svfLogo.png';
import ShareIcon from '@mui/icons-material/Share';

function Navbar( 
  {
    openSettings,
    openShare,
  }: {
    openSettings: () => void,
    openShare: () => void
  }
) {
  return (
    <div id='navbar'>
      {/* <h3>WebSVF</h3> */}
      {/* <a href="https://svf-tools.github.io/WebSVF/" target="_blank" rel="noopener noreferrer" id='webSVF-home-link'> */}
        <img src={svfLogo} alt='svf-logo' id='svf-logo' />
      {/* </a> */}
      <div>
        <SettingsIcon onClick={openSettings} id='settings-icon'/>
        <ShareIcon onClick={openShare} id='share-icon'/>
      </div>
      

    </div>
  );
}

export default Navbar;