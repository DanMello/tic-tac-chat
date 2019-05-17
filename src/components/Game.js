import React, { useState, useEffect } from 'react'
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
  const [inputWidth, setWidth] = useState(state.username.length + 'ch');
  let component;

  useEffect(() => {
    setWidth(state.username.length + 1 + 'ch')
  }, [state.username])

  function resetBoard () {
    dispatch({type: 'RESET_SQUARE'});
    resetHistory();
  };

  function changeUsername(e) {
    dispatch({type: 'UPDATE_USERNAME', username: e.target.value});
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
      />
      break;
    case "join":
      component = <Join 
        state={state}
        dispatch={dispatch}
        config={config}
      />
  }

  return (  
    <div className={Styles.Container}>
      <h1 className={Styles.heading}>Tic-Tac-Chat</h1>
      {!state.multiplayer &&
        <div className={Styles.subContainer}>
          <div className={Styles.usernameContainer}>
            <div className={Styles.atme}>@</div>
            <input
              className={Styles.username}
              style={{width: inputWidth}}
              onChange={changeUsername}
              value={state.username}
            />
          </div>
          <SelectMode mode={mode} setMode={setMode} />
        </div>
      }
      {component}
    </div>
  );
};