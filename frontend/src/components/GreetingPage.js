import * as React from 'react';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

import './../css/main.scss';
import Logo from './../assets/icons/microservice.png';

export default function GreetingPage({setCurrentWindow, openSchemeHandler}) {
  function openExistingProject() {
    setCurrentWindow('workspace');
    openSchemeHandler();
  }

  function openNewProject() {
    setCurrentWindow('workspace');
  }

  return (
    <div className='greetingPage'>
      <div className='left'>
        <img src={Logo} className='big-logo'></img>
      </div>
      <div className='right'>
        <div className='toolName'>MsConstructor</div>
        <div className='toolDescription'>Інструментарій побудови мікросервісних додатків</div>
        <button type="button" className="btn btn-primary btn-lg" onClick={openNewProject}>Створити новий проект</button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={openExistingProject}>Завантажити існуючий проект</button>
        <button type="button" className="btn btn-outline-primary"><HelpCenterIcon></HelpCenterIcon> Про інструментарій</button>
        <div className="copyrights">©2022 v0.1</div>
      </div>
    </div>
  );
}
