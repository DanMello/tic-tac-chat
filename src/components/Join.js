import React, { useState, useEffect } from 'react';
import OnlineBoard from './OnlineBoard';
import styles from 'styles/Join.css';

export default function Join ({state, dispatch, config, userNameError}) {
  
  const [games, setGames] = useState([]);
  let url;

  if (config.config.environment === 'development') {
    url = 'http://localhost:3004/availablegames';
  } else {
    url = 'https://game.mellocloud.com/availablegames';
  };

  function findGames(url) {
    fetch(url)
    .then(games => {
      return games.json()
    })
    .then(games => {
      setGames(games)
    }).catch(() => {
      setGames([])
    })
  };

  useEffect(() => {
    findGames(url)
  }, [state.gamesChanged])

  function joinGame(gameId, playersLength) {
    if (userNameError) {
      return;
    };
    if (playersLength > 1) {
      return;
    };
    const msg = {
      type: "joinGame",
      username: state.username,
      gameId: gameId
    };
    state.socket.send(JSON.stringify(msg))
  };

  return (
    <div className={styles.container}>
      {state.multiplayer === true ?
        <OnlineBoard state={state} dispatch={dispatch} />
        :
        <div>
          {games.length > 0 ?
            games.map(games => {
              return (
                <div key={games._id} className={styles.box}>
                  <div className={styles.roomName}>{games.roomName}</div>
                  <div className={styles.id}>
                    Game ID: {games._id}
                    </div>
                  <div className={styles.line}/>
                  {games.players.map(player => {
                    return (
                      <div key={player.move}>
                        <div className={styles.li}>
                          Player:
                          <div className={styles.value}>
                            {player.move}
                          </div>
                        </div>
                        <div className={styles.li}>
                          name:
                          <div className={styles.value}>
                          {player.username}
                          </div>
                        </div>
                        <div className={styles.line}/>
                      </div>
                    );
                  })}
                  <div 
                    className={games.players.length > 1 ? [styles.button, styles.disabled].join(' ') : styles.button}
                    onClick={() => joinGame(games._id, games.players.length)}
                    >
                    {games.players.length > 1 ? 'Game full' : 'Join game'}
                  </div>
                </div>
              );
            })
            :
            <div className={styles.noGames}>No games available to join</div>
          }
        </div>
      }
    </div>
  );
}