import React, { useState, useEffect } from 'react'
import Offline from './Offline';
import Create from './Create';
import Join from './Join';
import useConfig from '../hooks/config';
import useWebSocket from '../hooks/webSocket';
import useGameReducer from '../hooks/gameReducer';
import useTimeMachine from '../hooks/timeMachine';
import Styles from '../styles/Game.css';

export const ConfigContext = React.createContext();

export default function Game (config) {
  const {url, socketUrl, isMobile} = useConfig(config);
  const {socket, error} = useWebSocket(socketUrl);
  const [state, dispatch] = useGameReducer(socket);
  const {history, jumpToSquares, resetHistory} = useTimeMachine(state.squares, dispatch);
  const [mode, setMode] = useState('create');
  const [inputWidth, setWidth] = useState(state.username.length + 'ch');
  let component;

  useEffect(() => { 
    setWidth(state.username.length + 1 + 'ch')
  }, [state.username]);

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
      dispatch({type: 'ERROR', message: 'Username cannot be empty'});
    } else {
      dispatch({type: 'CLEAR_ERROR'});
    }
    dispatch({type: 'UPDATE_USERNAME', username: e.target.value});
  };

  switch(mode) {
    case "offline":
      component = <Offline
                    resetBoard={resetBoard} 
                    history={history}
                    jumpToSquares={jumpToSquares}
                    state={state} 
                    dispatch={dispatch}
                  />  
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
                  />
  }

  return (
    <ConfigContext.Provider value={{
      url: url, 
      isMobile: isMobile,
      setMode: setMode,
      mode: mode,
      changeUsername: changeUsername,
      inputWidth: inputWidth
      }}
      >
        <div className={Styles.mainContainer}>
          <div className={Styles.Container}>
            {component}
          </div>
        </div>
    </ConfigContext.Provider>
  );
};