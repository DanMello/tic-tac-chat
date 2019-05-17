import React, { useState, useEffect } from 'react';
import Board from './Board';
import Styles from 'styles/OnlineBoard.css';

export default function OnlineBoard({state, dispatch}) {
  
  const [chatMode, setChatMode] = useState(false);
  const [timeOut, storeTimeOut] = useState(null);
  const [message, setMessage] = useState('');

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

  function startChatMode(e) {
    if (!state.gameFull) return;
    setChatMode(true)
  };

  function stopChatMode(e) {
    setChatMode(false)
  };

  function setInput(e) {
    setMessage(e.target.value);
  };

  function sendMessage() {
    const msg = {
      type: "sendMessage",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId,
      message: message
    };
    state.socket.send(JSON.stringify(msg))
    setMessage('')
  };

  function leave() {
    const msg = {
      type: "leaveGame",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId
    };
    state.socket.send(JSON.stringify(msg))
  };

  function rematch() {
    const msg = {
      type: "rematch",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId
    };
    state.socket.send(JSON.stringify(msg))
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
        <div className={Styles.popUpMessage}>{response.message.substring(0, 30) + '...'}</div>
      </div>
      break;
  };

  return (  
    <div className={Styles.Container} style={{position: chatMode ? 'static' : 'relative'}}>
      {chatMode ?
        <div className={Styles.chatContainer}>
          <div className={Styles.anotherContainer}>
            <div className={Styles.subContainer}>
              <div 
                className={Styles.closeButton} 
                onClick={stopChatMode}>
                X
              </div>
              <input
                placeholder={'Say hi'}
                onChange={setInput}
                className={Styles.chatInput}
                value={message}
                autoFocus={true}
              />
              <div
                className={Styles.sendMessage} 
                onClick={sendMessage}>
                send
              </div>
            </div>
            <div className={Styles.line}/>
          </div>
          <div className={Styles.mainMessageContainer}>
            {state.chat.map((message, i) => {
              let component;
              message.clientID !== state.clientID ?
                component = (
                  <div className={Styles.messageContainerLeft} key={message.clientID + i}>
                    <div className={Styles.chatLeft}>{message.message}</div>
                  </div>
                )
                :
                component = (
                  <div className={Styles.messageContainerRight} key={state.clientID + i}>
                    <div className={Styles.chatRight}>{message.message}</div>
                  </div>
                )
                return component
            })}
          </div>
        </div>
        :
        <div className={Styles.boardContainer}>
          <div className={Styles.gameId}>Game ID: {state.gameId}</div>
          <div className={Styles.roomName}>{state.roomName}</div>
          {responseComponent}
          <Board state={state} dispatch={dispatch} />
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
      }
    </div>
  );
};