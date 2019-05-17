import React, {useEffect} from 'react';
import Board from './Board';
import Reset from './Reset';
import MoveList from './MoveList';
import styles from 'styles/offline.css';

export default function Offline ({ state, dispatch, resetBoard, history, jumpToSquares }) {

  useEffect(() => {
    resetBoard();
  }, [])

  return (
    <div className={styles.container}>
      <Board state={state} dispatch={dispatch} />
      <div className={styles.buttons}>
        <Reset resetBoard={resetBoard} />
        <MoveList history={history} jumpToSquares={jumpToSquares} />
      </div>
    </div>
  );
};