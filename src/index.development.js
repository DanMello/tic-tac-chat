import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game';
import './body.css';

ReactDOM.render(
  <div style={{padding: '10px'}}>
    <Game config={{environment: 'development'}} />
  </div>,
  document.getElementById('root'));