import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Board from '../components/Board';
import renderer from 'react-test-renderer';
import styles from 'styles/Board.css';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('Renders without crashing', () => {
  ReactDOM.render(<Board />, container);
});

it('Renders correctly', () => {
  const tree = renderer.create(<Board />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render 5 divs', () => {
  act(() => {
    ReactDOM.render(<Board />, container);
  });
  const divs = container.querySelectorAll('div');
  expect(divs.length).toEqual(5);
});

it('Each row should have 3 columns.', () => {
  act(() => {
    ReactDOM.render(<Board />, container);
  });
  const boardRows = container.querySelectorAll('.' + styles.boardRow);
  boardRows.forEach(row => {
    expect(row.children.length).toEqual(3);
  });
});

it('Board updates with X and O when user clicks on it.', () => {
  act(() => {
    ReactDOM.render(<Board />, container);
  });
  const squares = container.querySelectorAll('button');
  expect(squares[0].textContent).toBe('');
  act(() => {
    squares[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(squares[0].textContent).toBe('X');
  expect(squares[1].textContent).toBe('');
  act(() => {
    squares[1].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(squares[1].textContent).toBe('O');
});

it('Should still only render 5 divs if all columns are selected and game was a tie.', () => {
  act(() => {
    ReactDOM.render(<Board />, container);
  });
  const squares = container.querySelectorAll('button');
  const orderOfClicksByIndex = [0,1,2,4,3,5,6,7,8];
  orderOfClicksByIndex.forEach(index => {
    act(() => {
      squares[index].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  });
  const divs = container.querySelectorAll('div');
  expect(divs.length).toEqual(5);
});

it('Clicking should only change the column that was clicked, dont change the numbers on chunkIndex Variable.', () => {
  act(() => {
    ReactDOM.render(<Board />, container);
  });
  const squares = container.querySelectorAll('button');
  act(() => {
    squares[2].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  squares.forEach((_, index) => {
    if (index !== 2) {
      expect(squares[index].textContent).toBe('');
    }
  })
})