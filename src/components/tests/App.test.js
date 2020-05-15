import React from 'react';

import App from '../App';
import { MemoryRouter } from 'react-router-dom';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import Redux from '../../Redux';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {});

afterEach(() => {});

it('renders correctly', () => {
	const wrapper = shallow(
		<Redux>
			<App />
		</Redux>
	);

	//   expect(wrapper.find("div").length).toEqual(1);
});

it('renders correctly', () => {
	const tree = renderer
		.create(
			<Redux>
				<App />
			</Redux>
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});
