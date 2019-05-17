import React from 'react';
import styles from 'styles/moveList.css';
export default function MoveList({ history, jumpToSquares }) {
  
  function goToMove(e) {
    jumpToSquares(e.target.value)
  };

  return (
    <select onChange={goToMove} className={styles.select}>
      {history.map((_, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <option value={move}>
            {desc}
          </option>
        )})}
    </select>
  )
};
  // ) history.map((_, move) => {
  //   const desc = move ?
  //     'Go to move #' + move :
  //     'Go to game start';
  //   return (
  //     <select>
      
  //     </select>
  //   );
  // });
  // return <div>{moves}</div>
      // <li key={move}>
      //   <button onClick={() => jumpToSquares(move)}>{desc}</button>
      // </li>