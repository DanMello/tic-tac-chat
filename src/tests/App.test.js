import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('Renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Renders Welcome to your app.', () => {

  const wrapper = shallow(<App />);

  expect(wrapper.text()).toEqual('Welcome to your app.');
});