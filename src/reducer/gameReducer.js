import calculateWinner from '../helpers/calculateWinner';

export default function gameReducer(state, action) {
  const { squares, isXNext } = state;
  switch (action.type) {
    case 'SELECT_SQUARE': {
      const currentSquares = squares.slice();
      if (calculateWinner(squares) || squares[action.index]) {
        return state;
      }
      currentSquares[action.index] = isXNext ? 'X' : 'O';
      return {
        squares: currentSquares,
        isXNext: !isXNext
      }
    }
    case 'UPDATE_SQUARES': {
      return {
        squares: action.squares,
        isXNext: action.isXNext
      }
    }
    case 'RESET_SQUARE': {
      return {
        squares: Array(9).fill(null),
        isXNext: true
      }
    }
    default: {
      throw new Error(
        `Unhandled action type: ${action.type}. Please fix it. Thank you.`,
      )
    }
  };
};