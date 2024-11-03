import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './navbar.css';

function Navbar({ openSettings }: { openSettings: () => void }) {
  return (
    <div id="navbar">
      {/* <h3>WebSVF</h3> */}
      {/* <a href="https://svf-tools.github.io/WebSVF/" target="_blank" rel="noopener noreferrer" id='webSVF-home-link'> */}
      <img src="/svfLogo.png" alt="svf-logo" id="svf-logo" />
      {/* </a> */}
      <SettingsIcon onClick={openSettings} id="settings-icon" />
    </div>
  );
}

export default Navbar;
