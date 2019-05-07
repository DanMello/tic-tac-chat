import React, { useState } from 'react';
import Square from './Square';
import styles from 'styles/Board.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function chunk_array(array, chunks) {

  const chunk_array = array
    .map((_,i) => (i % chunks == 0) && array.slice(i,i+chunks))
    .filter(e => e);

  return chunk_array;
};

function Board() {
  const [ squares, setSquares ] = useState(Array(9).fill(null));
  const [ isXNext, setXNext ] = useState(true);
  const winner = calculateWinner(squares);
  const chunkedArray = chunk_array(squares, 3);
  let status;

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    nextSquares[i] = isXNext ? 'X' : 'O';
    setXNext(!isXNext);
    setSquares(nextSquares);
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
    setSquares(Array(9).fill(null));
    setXNext(true);
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
    </div>
  );
};

export default Board;