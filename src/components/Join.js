import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './Game';
import Menu from './Menu';
import OnlineBoard from './OnlineBoard';
import SearchGames from './SearchGames';
import ShowGames from './ShowGames';
import Loader from './Loader';
import styles from 'styles/Join.css';

export default function Join({ state, dispatch }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchValue, setValue] = useState('');
  const { url, isMobile } = useContext(ConfigContext);
  const [pageYOffset, setPageYOffset] = useState(0);
  const [headerHight, setHeaderHeight] = useState('0');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [top, setTop] = useState('0');
  const [loaderStep, setLoaderStep] = useState(0);
  const fixedHeader = React.createRef();
  const bottomContainerRef = React.createRef();
  const gamesContainerRef = React.createRef();

  useEffect(() => {
    window.addEventListener('scroll', hideNav);
    if (isMobile) {
      window.addEventListener('touchmove', swipe);
      window.addEventListener('touchend', swipeEnd);
      document.body.addEventListener('touchmove', swipe);
      document.body.addEventListener('touchend', swipeEnd);
    };
    return () => {
      window.removeEventListener('scroll', hideNav);
      if (isMobile) {
        window.removeEventListener('touchmove', swipe);
        window.removeEventListener('touchend', swipeEnd);
        document.body.removeEventListener('touchmove', swipe);
        document.body.removeEventListener('touchend', swipeEnd);
      };
    };
  });

  useEffect(() => {
    setTop('0');
  }, [state.error, state.gamesChanged]);

  useEffect(() => {
    if (fixedHeader.current !== null) {
      setHeaderHeight(fixedHeader.current.clientHeight);
    };
  }, [fixedHeader, state.error, state.gamesChanged]);

  useEffect(() => {
    if (url !== '') {
      findGames();
    };
  }, [url]);

  useEffect(() => {
    if (searchValue === '') {
      setFilteredGames([]);
    };
  }, [searchValue])

  function findGamesPromise() {
    return new Promise((resolve, reject) => {
      fetch(url + '/availablegames')
        .then(response => {
          return response.json();
        })
        .then(response => {
          if (response.type === 'error') {
            throw new Error(response.message);
          } else {
            resolve(response);
          };
        }).catch(err => {
          reject(err);
        });
    });
  };

  function findGames() {
    setLoading(true);
    findGamesPromise().then(response => {
      setGames(response);
      setLoading(false);
      dispatch({ type: 'CLEAR_NEW_GAMES' });
    }).catch(err => {
      setLoading(false);
      dispatch({ type: 'ERROR', message: err.message });
    });
  };

  function filterGames(keyName) {
    setLoading(true);
    fetch(url + '/findGames?name=' + keyName)
    .then(response => response.json()).then(response => {
      setLoading(false);
      if (response.type === 'error') {
        throw new Error(response.message);
      } else {
        setFilteredGames(response);
      };
    }).catch(err => {
      setLoading(false);
      dispatch({type: 'ERROR', message: err.message});
    });
  };

  //#stackoverflow :)
  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  };

  function hideNav() {
    const currentPageYOffset = window.pageYOffset;
    if (getDocHeight() < window.innerHeight + (window.innerHeight / 3)) {
      return;
    };
    if (currentPageYOffset < 0) {
      return;
    };
    if (Math.abs(currentPageYOffset - pageYOffset) < 80) {
      return;
    };
    if ((window.pageYOffset + window.innerHeight) >= getDocHeight()) {
      return;
    };
    if (pageYOffset > currentPageYOffset) {
      setTop('0');
    } else {
      setTop('-' + headerHight + 'px');
    };
    setPageYOffset(currentPageYOffset);
  };

  function swipe() {
    if (window.pageYOffset <= 0) {
      if (loaderStep === 4) return;
      if (bottomContainerRef.current !== null) {
        const offsetMove = bottomContainerRef.current.getBoundingClientRect().top;
        switch (true) {
          case (offsetMove <= 0):
            setLoaderStep(0);
            break;
          case (offsetMove < 25):
            setLoaderStep(1);
            break;
          case (offsetMove < 35):
            setLoaderStep(2);
            break;
          case (offsetMove < 45):
            setLoaderStep(3);
            break;
        };
      };
    } else {
      setLoaderStep(0);
    };
  };

  function swipeEnd() {
    if (loaderStep === 3) {
      setLoaderStep(4);
      findGamesPromise().then(response => {
        setLoaderStep(0);
        setGames(response);
        if (searchValue) {
          filterGames(searchValue);
        };
        dispatch({ type: 'CLEAR_NEW_GAMES' });
      }).catch(err => {
        setLoaderStep(0);
        dispatch({ type: 'ERROR', message: err.message });
      });
    } else {
      setLoaderStep(0);
    };
  };

  function joinGame(gameId, playersLength) {
    if (state.username === '') {
      dispatch({ type: 'ERROR', message: 'Username cannot be empty.' });
      return;
    } else if (playersLength > 1) {
      dispatch({ type: 'ERROR', message: 'Game is full.' });
      return;
    } else {
      dispatch({ type: 'CLEAR_ERROR' });
    };
    const msg = {
      type: "joinGame",
      username: state.username,
      gameId: gameId
    };
    state.socket.send(JSON.stringify(msg))
  };

  let arrayOfGames;

  if (filteredGames.length > 0 || searchValue) {
    arrayOfGames = filteredGames;
  } else {
    arrayOfGames = games;
  };

  return (
    <div>
      {state.multiplayer === true ?
        <OnlineBoard state={state} dispatch={dispatch} />
        :
        <div className={styles.container}>
          <div
            className={isMobile ? styles.searchingContainer : styles.searchingContainerDesktop}
            style={{ top: top }}
            ref={fixedHeader}
          >
            <Menu state={state} dispatch={dispatch} findGames={findGames} />
            {games.length > 1 &&
              <SearchGames
                filterGames={filterGames}
                setValue={setValue}
                setTyping={setTyping}
              />
            }
          </div>
          <div className={styles.subContainer}>
            {loading ?
              <Loader className={styles.loader} color={'#03a9f4'} style={{ top: headerHight + 10 + 'px' }} />
              :
              <div className={styles.paddingContainer} ref={bottomContainerRef} style={top !== '0' ? { paddingTop: '10px' } : { paddingTop: headerHight + 'px' }}>
                {isMobile &&
                  <div
                    className={styles.loaderTwoContainer}
                    style={loaderStep === 0 ? { marginBottom: '-40px' } : { marginBottom: '0px' }}
                  >
                    <Loader
                      loaderStep={loaderStep}
                      color={'white'}
                    />
                  </div>
                }
                {arrayOfGames.length > 0 ?
                  <div className={styles.gamesContainer} ref={gamesContainerRef}>
                    {arrayOfGames.map(games => {
                      return <ShowGames games={games} joinGame={joinGame} key={games._id} />
                    })}
                  </div>
                  :
                  <div className={styles.noGames}>
                    {!typing ? 'No games found.' : ''}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  );
};