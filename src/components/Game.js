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
  const {socket, error} = useWebSocket(config);
  const [state, dispatch] = useGameReducer(socket);
  const {history, jumpToSquares, resetHistory} = useTimeMachine(state.squares, dispatch);
  const [mode, setMode] = useState('create');
  const [inputWidth, setWidth] = useState(state.username.length + 'ch');
  const [userNameError, setError] = useState(false);
  let component;

  useEffect(() => {
    setWidth(state.username.length + 1 + 'ch')
  }, [state.username])

  useEffect(() => {
    if (error !== null) {
      dispatch({type: 'ERROR', message: error})
    }
  }, [error])

  function resetBoard () {
    dispatch({type: 'RESET_SQUARE'});
    resetHistory();
  };

  function changeUsername(e) {
    if (e.target.value === '') {
      setError('Username cannot be empty');
    } else {
      setError(false);
    }
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
        userNameError={userNameError}
        dispatch={dispatch}
      />
      break;
    case "join":
      component = <Join 
        state={state}
        userNameError={userNameError}
        dispatch={dispatch}
        config={config}
      />
  }

  return ( 
    <div className={Styles.mainContainer}>
      <div className={(state.error || userNameError) ? Styles.error : ''}>{state.error || userNameError}</div>
      <div className={Styles.Container} style={state.error ? {borderTopLeftRadius: '0px', borderTopRightRadius: '0px'} : {borderRadius: 'initial !important'}}>
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
    </div>
  );
};