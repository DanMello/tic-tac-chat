import React, { useState } from 'react'
import SelectMode from './SelectMode';
import Offline from './Offline';
import Create from './Create';
import Join from './Join';
import useWebSocket from '../hooks/webSocket';
import useGameReducer from '../hooks/gameReducer';
import useTimeMachine from '../hooks/timeMachine';
import Styles from '../styles/Game.css';

export default function Game (config) {
  const {socket} = useWebSocket(config);
  const [state, dispatch] = useGameReducer(socket);
  const {history, jumpToSquares, resetHistory} = useTimeMachine(state.squares, dispatch);
  const [mode, setMode] = useState('create');
  let component;

  function resetBoard () {
    dispatch({type: 'RESET_SQUARE'});
    resetHistory();
  };

  switch(mode) {
    case "offline":
      component = <Offline
        state={state}
        dispatch={dispatch} 
        resetBoard={resetBoard} 
        history={history}
        jumpToSquares={jumpToSquares}
      />;
      break;
    case "create": 
      component = <Create 
        state={state}
        dispatch={dispatch}
        socket={socket} 
      />
      break;
    case "join":
      component = <Join 
        state={state}
        dispatch={dispatch}
        socket={socket}
      />
  }

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.heading}>Tic-Tac-Chat</h1>
      <SelectMode setMode={setMode} />
      {component}
    </div>
  );
};