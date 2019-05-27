export default function gameReducer(state, action) {
  const {
    squares,
    isXNext,
    move,
    gameId,
    roomName,
    username,
    otherUser,
    allPlayers,
    multiplayer,
    gameFull,
    socket,
    clientID,
    chat,
    gameOver,
    response,
    rematch,
    error,
    gamesChanged
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
        gameId: action.data.gameId,
        roomName: action.data.roomName,
        move: action.data.move,
        username: action.data.username,
        clientID: action.data.clientID,
        multiplayer: true
      };
    }
    case 'joinGame': {
      return {
        ...state,
        gameId: action.data.gameId,
        move: action.data.move,
        roomName: action.data.roomName,
        username: action.data.username,
        clientID: action.data.clientID,
        multiplayer: true
      };
    }
    case 'notifyAllUsers': {
      const you = {username: username, move: move, clientID: clientID};
      const otherUser = action.data.users.filter(user => user.move !== move);
      const players = [you].concat(otherUser[0]);

      return {
        ...state,
        otherUser: otherUser,
        allPlayers: players,
        response: {
          type: 'userJoined',
          userThatJoined: action.data.userThatJoined
        },
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
    case "messageDelivered": {
      return {
        ...state,
        delivered: true
      };
    }
    case "newMessages" : {
      const newMessages = chat.concat({
        message: action.data.message,
        clientID: action.data.clientID,
        username: action.data.username
      })
      return {
        ...state,
        chat: newMessages,
        response: {
          type: 'latestMessage',
          username: action.data.username,
          message: action.data.message
        }
      }
    }
    case "UPDATE_SOCKET": {
      return {
        ...state,
        socket: action.socket
      };
    }
    case "UPDATE_USERNAME": {
      return {
        ...state,
        username: action.username
      };
    }
    case "leaveGame": {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        move: null,
        gameId: null,
        roomName: null,
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        multiplayer: false,
        gameFull: false,
        chat: []
      };
    }
    case "notifyUserLeft": {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        gameFull: false,
        chat: [],
        response: {
          type: 'userLeft',
          username: action.data.username
        }
      }
    }
    case "GAME_OVER": {
      return {
        ...state,
        gameOver: true
      };
    }
    case "CLEAR_RESPONSE": {
      return {
        ...state,
        response: {}
      }
    }
    case "removeRematchButton": {
      return {
        ...state,
        rematch: true
      }
    }
    case "rematch": {
      return {
        ...state,
        response: {
          type: 'rematch',
          username: action.data.username
        }
      }
    }
    case "rematchStart" : {
      return {
        ...state,
        response: {
          type: 'rematchStarted'
        },
        rematch: false,
        squares: Array(9).fill(null),
        isXNext: false,
        gameOver: false
      }
    }
    case "error" : {
      return {
        ...state,
        error: action.data.message
      }
    }
    case "playerDisconnect" : {
      return {
        ...state,
        gameFull: false,
        allPlayers: [],
        otherUser: [],
        response: {
          type: 'playerDisconnect',
          playerName: action.data.player.username
        },
        rematch: false,
        squares: Array(9).fill(null),
        isXNext: true,
        gameOver: false,
        chat: [],
      }
    }
    case "gamesChanged" : {
      return {
        ...state,
        gamesChanged: !gamesChanged
      };
    }
    case "ERROR" : {
      return {
        ...state,
        error: action.message
      }
    }
    case "RESET_STATE" : {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        move: null,
        gameId: null,
        roomName: null,
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
        gamesChanged: !gamesChanged
      }
    }
  };
};