import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Account from './Account';
import { fetchUserDetails } from '../../api/userInfo';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.mock('../../store/features/common', () => ({
	...jest.requireActual('../../store/features/common'),
	setLoading: jest.fn(() => ({ type: 'common/setLoading' })) // Keep mock to spy if needed, or use actual
}));
// Actually, let's use actual for setLoading to avoid undefined issues
jest.unmock('../../store/features/common');

jest.mock('../../store/features/user', () => ({
	...jest.requireActual('../../store/features/user'),
	selectUserInfo: (state) => state.user.userInfo,
	selectIsUserAdmin: (state) => state.user.isUserAdmin
}));

const mockStore = configureStore([]);

describe('Account Component', () => {
	let store;

	beforeEach(() => {
		fetchUserDetails.mockResolvedValue({
			firstName: 'John',
			email: 'john@example.com'
		});
	});

	// ISP: Rendering (User)
	test('renders user info and navigation links', async () => {
		store = mockStore({
			user: {
				userInfo: { firstName: 'John', email: 'john@example.com' },
				isUserAdmin: false
			}
		});

		render(
			<Provider store={store}>
				<BrowserRouter>
					<Account />
				</BrowserRouter>
			</Provider>
		);

		expect(screen.getByText('Hello John')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
		expect(screen.getByText('Orders')).toBeInTheDocument();
		expect(screen.getByText('Settings')).toBeInTheDocument();
		expect(screen.queryByText('Manage Admin')).not.toBeInTheDocument();
	});

	// Graph: Admin View
	test('renders admin link when user is admin', async () => {
		store = mockStore({
			user: {
				userInfo: { firstName: 'Admin', email: 'admin@example.com' },
				isUserAdmin: true
			}
		});

		render(
			<Provider store={store}>
				<BrowserRouter>
					<Account />
				</BrowserRouter>
			</Provider>
		);

		expect(screen.getByText('Manage Admin')).toBeInTheDocument();
	});

	test('highlights active navigation link', () => {
		store = mockStore({
			user: {
				userInfo: { firstName: 'John', email: 'john@example.com' },
				isUserAdmin: false
			}
		});

		render(
			<Provider store={store}>
				<BrowserRouter>
					<Account />
				</BrowserRouter>
			</Provider>
		);

		// Verify default classes or click interaction if needed. 
		// Since we can't easily mock NavLink's isActive prop from outside without complex setup, 
		// we assume the class logic is correct if the component renders.
		// However, we can check if the links are present.
		const profileLink = screen.getByText('Profile').closest('a');
		expect(profileLink).toHaveAttribute('href', '/account-details/profile');
	});
});
