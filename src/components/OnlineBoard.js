import React, { useState, useEffect } from 'react';
import Board from './Board';
import Styles from 'styles/OnlineBoard.css';
import Chat from './Chat';

export default function OnlineBoard({state, dispatch, sendMessage}) {
  
  const [chatMode, setChatMode] = useState(false);
  const [timeOut, storeTimeOut] = useState(null);

  useEffect(() => {
    if (state.gameFull === false && chatMode) {
      setChatMode(false);
    }
  }, [state.gameFull])

  useEffect(() => {
    if (state.response.type !== undefined) {
      clearTimeout(timeOut)
      const timeout = setTimeout(() => {
        dispatch({type: "CLEAR_RESPONSE"})
      }, 5000)
      storeTimeOut(timeout)
    }
    return () => {
      clearTimeout(timeOut)
    }
  }, [state.response])

  function startChatMode() {
    if (!state.gameFull) return;
    setChatMode(true);
  };

  function leave() {
    const msg = {
      type: "leaveGame",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId
    };
    sendMessage(msg);
  };

  function rematch() {
    const msg = {
      type: "rematch",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId
    };
    sendMessage(msg);
  };

  function reduceString(string) {
    return string.substring(0, 30) + (string.length > 30 ? '...' : '');
  };

  let responseComponent;
  let {response} = state;

  switch(response.type) {
    case 'rematchStarted': {
      responseComponent = <div className={Styles.popUpOne}>Game has restarted.</div>
      break;
    }
    case 'rematch': 
      responseComponent = <div className={Styles.popUpOne}>{response.username} wants to rematch.</div>
      break;
    case 'userJoined':
      responseComponent = <div className={Styles.popUpOne}>{response.userThatJoined} has joined.</div>
      break;
    case 'userLeft':
      responseComponent = <div className={Styles.popUpOne}>{response.username} has left.</div>
      break;
    case 'latestMessage':
      responseComponent = <div className={Styles.popUpTwo} onClick={startChatMode}>
        <div className={Styles.popUpName}>{response.username[0]}</div>
        <div className={Styles.popUpMessage}>{reduceString(response.message)}</div>
      </div>
      break;
    case 'playerDisconnect': 
    responseComponent = <div className={Styles.popUpOne}>{response.playerName} has been disconnected.</div>
      break;
  };

  return (
    <div>
      {chatMode ?
        <Chat state={state} setChatMode={setChatMode} sendMessage={sendMessage}/>
        :
        <div className={Styles.container}>
          <div className={Styles.version}>v1.0.0</div>
          <h1 className={Styles.heading}>Tic-Tac-Chat</h1>
          <div className={Styles.boardContainer}>
            <div className={Styles.gameId}>Game ID: {state.gameId}</div>
            <div className={Styles.roomName}>{state.roomName}</div>
            {responseComponent}
            <Board state={state} dispatch={dispatch} sendMessage={sendMessage}/>
            <div
              className={Styles.chatButton}
              onClick={startChatMode}
              >
              {!state.gameFull ? 'You can chat once other player joins.' : 'Say hi..'}
            </div>
            <div className={Styles.bottomContainer}>
              <div onClick={leave} className={Styles.leave}>Leave game</div>
              {state.gameOver && !state.rematch &&
                <div
                  onClick={rematch}
                  className={Styles.rematch}
                  >
                  Rematch
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
};