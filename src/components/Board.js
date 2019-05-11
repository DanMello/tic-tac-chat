import React, { useReducer } from 'react';
import Square from './Square';
import styles from 'styles/Board.css';
import calculateWinner from '../helpers/calculateWinner';
import chunkArray from '../helpers/chunkArray';
import gameReducer from '../reducer/gameReducer';
import MoveList from './MoveList';
import useTimeMachine from '../hooks/timeMachine';

function Board() {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true
  });
  const {history, jumpToSquares, resetHistory} = useTimeMachine(state.squares, dispatch);
  const {squares, isXNext} = state;
  const winner = calculateWinner(squares);
  const chunkedArray = chunkArray(squares, 3);
  let status;

  function handleClick(i) {
    dispatch({type: 'SELECT_SQUARE', index: i});
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

  function resetSquares() {
    dispatch({type: 'RESET_SQUARE'});
    resetHistory();
  };

  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!winner && squares.every(item => item !== null)) {
    status = 'Game was a tie'
  } else {
    status = 'Next player: ' + (isXNext ? 'X' : 'O');
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
      <div id='resetButton' className={styles.resetButton} onClick={resetSquares}>Reset</div>
      <MoveList history={history} jumpToSquares={jumpToSquares}/>
    </div>
  );
};

export default Board;