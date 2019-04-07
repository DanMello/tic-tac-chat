import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../components/Board';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Board />, div);
});

it('Renders correctly', () => {
  const tree = renderer
    .create(<Board />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Board', () => {
  it('renders the next value when board is clicked.', () => {
    const wrapper = mount(<Board />);
    const firstsquare = wrapper.find('button.square').at(0);
    const secondsquare = wrapper.find('button.square').at(1);
    expect(firstsquare.text()).toEqual('');
    firstsquare.simulate('click');
    expect(firstsquare.text()).toEqual('X');
    expect(secondsquare.text()).toEqual('');
    secondsquare.simulate('click');
    expect(secondsquare.text()).toEqual('O');
  });
});