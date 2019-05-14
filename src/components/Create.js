import React, { useState } from 'react';
import Board from './Board';
import styles from 'styles/Create.css';

export default function Create ({state, dispatch}) {

  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  function createGame() {
    if (name === '') {
      setError('Please enter your name.');
      return;
    };
    const msg = {
      type: "createGame",
      playerName: name
    };
    state.socket.send(JSON.stringify(msg))
  };  

  function changeName(e) {
    setError('');
    setName(e.target.value);
  };

  return (
    <div className={styles.container}>
      {state.multiplayer === true ?
        <div>
          <h1>Room ID: {state.roomId}</h1>
          <Board state={state} dispatch={dispatch}/>
        </div>
        :
        <div>
          {error}
          <label>Enter your name: </label>
          <input value={name} onChange={changeName} />
          <button onClick={createGame}>
            Create Game
          </button>
        </div>
      }
    </div>
  );
}