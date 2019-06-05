import React, {useContext} from 'react';
import Styles from 'styles/Menu.css';
import SelectMode from './SelectMode';
import { ConfigContext } from './Game';

export default function Menu({state, dispatch, findGames}) {

  const {mode, setMode, changeUsername, inputWidth, isMobile} = useContext(ConfigContext);

  function dismissError() {
    dispatch({type: 'CLEAR_ERROR'});
  };

  function updateGames() {
    dispatch({type: 'CLEAR_NEW_GAMES'});
    findGames();
  };

  return (
    <div className={Styles.mainContainer}>
      <div className={state.error ? Styles.error : ''}>
        {state.error && 
          <div className={Styles.errorContainer}>
            {state.error}
            <div className={Styles.dismiss} onClick={dismissError}>dismiss</div>
          </div> 
        }
      </div>
      <div>
      {!state.error && state.gamesChanged && !state.multiplayer && mode === 'join' &&
          <div className={Styles.newGamesContainer}>
            Games have been updated. {isMobile ? ' Pull to refresh.' : <div className={Styles.dismiss} onClick={updateGames}>update games</div>}
          </div> 
        }
      </div>
      <h1 className={Styles.heading}>Tic-Tac-Chat</h1>
      {!state.multiplayer &&
        <div className={Styles.subContainer}>
          <div className={Styles.usernameContainer}>
            <div className={Styles.atme}>@</div>
            <input
              className={Styles.username}
              style={{width: inputWidth}}
              onChange={changeUsername}
              value={state.username}
            />
          </div>
          <SelectMode mode={mode} setMode={setMode} />
        </div>
      }
    </div>
  );
};