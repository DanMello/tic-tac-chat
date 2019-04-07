import React from 'react';
import Square from '../components/Square';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

it('Renders correctly', () => {
  const tree = renderer
    .create(<Square />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Square', () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Square value={''} onClick={jest.fn()} />));

  it('renders the value', () => {
    wrapper.setProps({value: 'X'});
    expect(wrapper.find('.square').text()).toEqual('X');
  });
});
