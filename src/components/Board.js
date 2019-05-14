import React from 'react';
import Square from './Square';
import styles from 'styles/Board.css';
import calculateWinner from '../helpers/calculateWinner';
import chunkArray from '../helpers/chunkArray';

function isPlayerNext(state) {
  const {isXNext,allPlayers} = state;
  const nextMove = (isXNext ? 'X' : 'O');
  const nextPlayer = allPlayers
    .filter(user => user.player === nextMove)
    .reduce((acc, current) => ({...acc, ...current}), {});

  return nextPlayer.name;
};

function gameStatus(state) {
  let {squares, isXNext, otherUser, allPlayers, multiplayer, gameFull} = state;
  let winner = calculateWinner(squares);
  let nextMove = (isXNext ? 'X' : 'O');
  let status;

  if (winner) {
    if (multiplayer) {
      const playerThatWon = allPlayers
        .filter(user => user.player === winner)
        .reduce((acc, current) => ({...acc, ...current}), {});

      status = playerThatWon.name + ' is the winner!';
    } else {
      status = 'Winner: ' + winner;
    };
  } else if (!winner && squares.every(item => item !== null)) {
    status = 'Game was a tie';
  } else if (multiplayer && !gameFull) {
    status = 'Waiting for second player to join.'
  } else if (multiplayer && gameFull) {
    status = 'Next player: ' + isPlayerNext(state);
  } else {
    status = 'Next player: ' + nextMove;
  };
  return status;
};

function Board({state, dispatch}) {
  const { squares, socket, gameFull, multiplayer, name } = state;
  const status = gameStatus(state);
  const chunkedArray = chunkArray(squares, 3);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    };
    if (multiplayer) {
      if (!gameFull) {
        return;
      }
      if (name !== isPlayerNext(state)) {
        alert('its not your turn');
        return;
      }
      const msg = {
        type: "updateSquares",
        index: i,
        room: state.roomId
      };
      socket.send(JSON.stringify(msg));
    } else {
      dispatch({type: 'SELECT_SQUARE', index: i});
    };
  };

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
      />
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div id='status' className={styles.status}>{status}</div>
      {chunkedArray.map((array, i) => {
        return (
          <div key={i} className={styles.boardRow}>
            {array.map((_, index) => {
              const chunkIndex = i > 0 ? ((i * 3) + index) : index;
              return renderSquare(chunkIndex);
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;