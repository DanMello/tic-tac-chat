import { useEffect, useReducer} from 'react';
import gameReducer from '../reducer/gameReducer';

export default function useGameReducer (socket) {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true,
    move: null,
    gameId: null,
    roomName: null,
    username: '',
    allPlayers: [],
    otherUser: [],
    multiplayer: false,
    gameFull: false,
    socket: socket,
    clientID: null,
    chat: [],
    gameOver: false,
    response: {},
    rematch: false,
    error: false,
    gamesChanged: false
  });

  useEffect(() => {
    function createSocketEvents(event) {
      const data = JSON.parse(event.data);
      dispatch({
        type: data.type,
        data: data
      });
    };
    function closeSocket() {
      dispatch({type: 'RESET_STATE'})
      dispatch({type: 'ERROR', message: 'Lost connection to server please refresh page.'})
    };
    if (socket !== null) {
      socket.addEventListener('message', createSocketEvents);
      socket.addEventListener('close', closeSocket);
      dispatch({type: 'UPDATE_SOCKET', socket: socket});
      return () => {
        socket.removeEventListener('message', createSocketEvents);
        socket.removeEventListener('close', closeSocket);
      };
    };
  }, [socket]);

  useEffect(() => {
    function randomUsername() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return ('user' + S4()+S4());
    };
    const username = localStorage.getItem('username');
    if (username === null || username === '') {
      dispatch({type: 'UPDATE_USERNAME', username: randomUsername()});
    } else {
      dispatch({type: 'UPDATE_USERNAME', username: username});
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('username', state.username);
  }, [state.username]);

  return [state, dispatch];
};