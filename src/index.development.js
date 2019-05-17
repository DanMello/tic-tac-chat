import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game';
import './body.css';

ReactDOM.render(
  <div style={{width: '100%'}}>
    <Game config={{environment: 'development'}} />
  </div>,
  document.getElementById('root'));