import React from 'react';
import styles from 'styles/selectMode.css';

export default function SelectMode ({setMode}) {

  function mode(mode) {
    setMode(mode);
  };

  return (
    <div className={styles.container}>
      <div onClick={() => mode('offline')}>Play offline</div>
      <div onClick={() => mode('create')}>Create game</div>
      <div onClick={() => mode('join')}>Join game</div>
    </div>
  );
};  