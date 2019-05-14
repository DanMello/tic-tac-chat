import { useEffect, useReducer} from 'react';
import gameReducer from '../reducer/gameReducer';

export default function useGameReducer (socket) {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true,
    player: null,
    roomId: null,
    name: null,
    allPlayers: [],
    otherUser: [],
    multiplayer: false,
    gameFull: false,
    socket: socket
  });
  useEffect(() => {
    function createSocketEvents(event) {
      const data = JSON.parse(event.data);
      dispatch({
        type: data.type,
        data: data
      });
    };
    if (socket !== null) {
      socket.addEventListener('message', createSocketEvents);
      dispatch({type: 'UPDATE_SOCKET', socket: socket});
      return () => {
        socket.removeEventListener('message', createMultiplayerEvents);
      };
    };
  }, [socket]);

  return [state, dispatch];
};