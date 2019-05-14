import React, { useState } from 'react';
import Board from './Board';
import styles from 'styles/Create.css';

export default function Join ({state, dispatch}) {
  
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState(null);

  function joinGame() {
    if (name === '') {
      setError('Please enter your name.');
      return;
    };
    if (id === '') {
      setError('Please enter room ID.');
      return;
    };
    const msg = {
      type: "joinGame",
      room: id,
      name: name
    };
    state.socket.send(JSON.stringify(msg))
  };

  function changeName(e) {
    setError('');
    setName(e.target.value);
  };

  function changeId(e) {
    setError('');
    setId(e.target.value);
  };

  return (
    <div className={styles.container}>
      {state.multiplayer === true ?
        <div>
          <h1>Room ID: {state.roomId}</h1>
          <Board state={state} dispatch={dispatch} />
        </div>
        :
        <div>
          {error}
          <label>Enter your name: </label>
          <input value={name} onChange={changeName} />
          <label>Enter room ID: </label>
          <input value={id} onChange={changeId} />
          <button onClick={joinGame}>
            Join game
          </button>
        </div>
      }
    </div>
  );
}