import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game';
import './body.css';

ReactDOM.render(
  <div>
    <Game configuration={{environment: 'development', isMobile: true}} />
  </div>,
  document.getElementById('root'));