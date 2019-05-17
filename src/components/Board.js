import React,{ useEffect }from 'react';
import Square from './Square';
import styles from 'styles/Board.css';
import calculateWinner from '../helpers/calculateWinner';
import chunkArray from '../helpers/chunkArray';

function isPlayerNext(state) {
  const {isXNext,allPlayers} = state;
  const nextMove = (isXNext ? 'X' : 'O');
  const nextPlayer = allPlayers
    .filter(user => user.move === nextMove)
    .reduce((acc, current) => ({...acc, ...current}), {});

  return nextPlayer;
};

function gameStatus(state) {
  let {squares, isXNext, allPlayers, multiplayer, gameFull} = state;
  let winner = calculateWinner(squares);
  let nextMove = (isXNext ? 'X' : 'O');
  let status;
  let gameOver;

  if (winner) {
    if (multiplayer) {
      const playerThatWon = allPlayers
        .filter(user => user.move === winner)
        .reduce((acc, current) => ({...acc, ...current}), {});

      status = playerThatWon.username + ' is the winner!';
    } else {
      status = 'Winner: ' + winner;
    };
    gameOver = true;
  } else if (!winner && squares.every(item => item !== null)) {
    status = 'Game was a tie';
    gameOver = true;
  } else if (multiplayer && !gameFull) {
    status = 'Waiting for second player to join.'
  } else if (multiplayer && gameFull) {
    const nextPlayer = isPlayerNext(state);
    status = 'Next player: ' + nextPlayer.username;
  } else {
    status = 'Next player: ' + nextMove;
  };
  return {
    status,
    gameOver
  };
};

function Board({state, dispatch}) {
  const { squares, socket, gameFull, multiplayer, clientID } = state;
  const status = gameStatus(state);
  const chunkedArray = chunkArray(squares, 3);

  useEffect(() => {
    if (status.gameOver === true) {
      dispatch({type: 'GAME_OVER'})
    };
  }, [status.gameOver])

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    };
    if (multiplayer) {
      if (!gameFull) {
        return;
      }
      const nextPlayer = isPlayerNext(state);
      if (clientID !== nextPlayer.clientID) {
        alert('its not your turn');
        return;
      }
      const msg = {
        type: "updateSquares",
        index: i,
        gameId: state.gameId
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
      <div id='status' className={styles.status}>{status.status}</div>
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