import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Profile from './Profile';
import { deleteAddressAPI } from '../../api/userInfo';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.unmock('../../store/features/common');
jest.mock('../../store/features/user', () => ({
	...jest.requireActual('../../store/features/user'),
	selectUserInfo: (state) => state.user.userInfo
}));
jest.mock('./AddAddress', () => ({ onCancel }) => (
	<div>
		Add Address Form
		<button onClick={onCancel}>Cancel</button>
	</div>
));

const mockStore = configureStore([]);

describe('Profile Component', () => {
	let store;
	const mockUserInfo = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		phoneNumber: '1234567890',
		addressList: [
			{ id: 1, name: 'Home', street: '123 St', city: 'City', state: 'State', zipCode: '12345' }
		]
	};

	beforeEach(() => {
		store = mockStore({
			user: { userInfo: mockUserInfo }
		});
		deleteAddressAPI.mockResolvedValue({});
	});

	// ISP: Rendering
	test('renders profile info and addresses', () => {
		render(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('123 St,City,State')).toBeInTheDocument();
	});

	test('renders None when phone number is missing', () => {
		const userInfoNoPhone = { ...mockUserInfo, phoneNumber: null };
		store = mockStore({
			user: { userInfo: userInfoNoPhone }
		});

		render(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		expect(screen.getByText('None')).toBeInTheDocument();
	});

	// Graph: Interaction
	test('opens add address form', () => {
		render(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		fireEvent.click(screen.getByText('Add New'));
		expect(screen.getByText('Add Address Form')).toBeInTheDocument();

		fireEvent.click(screen.getByText('Cancel'));
		expect(screen.queryByText('Add Address Form')).not.toBeInTheDocument();
	});

	test('deletes address', async () => {
		render(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		fireEvent.click(screen.getByText('Remove'));

		await waitFor(() => {
			expect(deleteAddressAPI).toHaveBeenCalledWith(1);
		});
	});
});
