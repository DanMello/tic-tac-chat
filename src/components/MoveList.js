import React from 'react';

export default function MoveList({ history, jumpToSquares }) {
  const moves = history.map((_, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpToSquares(move)}>{desc}</button>
      </li>
    );
  });
  return <div>{moves}</div>
};