import calculateWinner from '../helpers/calculateWinner';

export default function gameReducer(state, action) {
  const {
    squares,
    isXNext,
    player,
    roomId,
    name,
    otherUser,
    allPlayers,
    multiplayer,
    gameFull,
    socket 
  } = state;

  switch (action.type) {
    case 'SELECT_SQUARE': {
      const currentSquares = squares.slice();
      currentSquares[action.index] = isXNext ? 'X' : 'O';
      return {
        ...state,
        squares: currentSquares,
        isXNext: !isXNext
      }
    }
    case 'UPDATE_SQUARES': {
      return {
        ...state,
        squares: action.squares,
        isXNext: action.isXNext
      }
    }
    case 'RESET_SQUARE': {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true
      }
    }
    case 'createGame': {
      return {
        ...state,
        roomId: action.data.room,
        player: action.data.player,
        name: action.data.name,
        multiplayer: true
      };
    }
    case 'joinGame': {
      return {
        ...state,
        roomId: action.data.room,
        player: action.data.player,
        name: action.data.name,
        multiplayer: true
      };
    }
    case 'notifyAllUsers': {
      const you = {name: name, player: player, room: roomId};
      const otherUser = action.data.users.filter(user => user.player !== player);
      const players = [you].concat(otherUser[0]);

      return {
        ...state,
        otherUser: otherUser,
        allPlayers: players,
        gameFull: true
      };
    }
    case "updateSquares": {
      const currentSquares = squares.slice();
      currentSquares[action.data.index] = isXNext ? 'X' : 'O';
      return {
        ...state,
        squares: currentSquares,
        isXNext: !isXNext
      };
    }
    case "UPDATE_SOCKET": {
      return {
        ...state,
        socket: action.socket
      };
    }
  };
};