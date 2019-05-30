import React, { useState } from 'react';
import Styles from 'styles/Chat.css';

export default function Chat({state, setChatMode}) {

  const [message, setMessage] = useState('');

  function stopChatMode() {
    setChatMode(false);
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

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage(e.target.value)
    }
  };

  return (
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
            onKeyDown={handleKeyDown}
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
  );
};