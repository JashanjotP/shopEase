import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navigation from './Navigation';

// Mock dependencies
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
}));

jest.mock('../common/Wishlist', () => ({ Wishlist: () => <div data-testid="wishlist-icon">Wishlist</div> }));
jest.mock('../common/AccountIcon', () => ({ AccountIcon: () => <div data-testid="account-icon">AccountIcon</div> }));
jest.mock('../common/CartIcon', () => ({ CartIcon: () => <div data-testid="cart-icon">CartIcon</div> }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

describe('Navigation Component', () => {
	beforeEach(() => {
		useSelector.mockReturnValue(0); // Default cart count
		mockNavigate.mockClear();
	});

	// ISP: Variant 'default'
	test('renders default variant with nav items and search', () => {
		render(
			<BrowserRouter>
				<Navigation variant="default" />
			</BrowserRouter>
		);

		expect(screen.getByText('ShopEase')).toBeInTheDocument();
		expect(screen.getByText('Shop')).toBeInTheDocument();
		expect(screen.getByText('Men')).toBeInTheDocument();
		expect(screen.getByText('Women')).toBeInTheDocument();
		expect(screen.getByText('Kids')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

		expect(screen.getByTestId('wishlist-icon')).toBeInTheDocument();
		expect(screen.getByTestId('account-icon')).toBeInTheDocument();
		expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
	});

	// ISP: Variant 'auth'
	test('renders auth variant with login/signup buttons', () => {
		render(
			<BrowserRouter>
				<Navigation variant="auth" />
			</BrowserRouter>
		);

		expect(screen.getByText('ShopEase')).toBeInTheDocument();
		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByText('Signup')).toBeInTheDocument();

		// Should NOT render default items
		expect(screen.queryByText('Shop')).not.toBeInTheDocument();
		expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
		expect(screen.queryByTestId('wishlist-icon')).not.toBeInTheDocument();
	});

	// Graph: Cart count display logic
	test('displays cart count when greater than 0', () => {
		useSelector.mockReturnValue(5);
		render(
			<BrowserRouter>
				<Navigation variant="default" />
			</BrowserRouter>
		);
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	test('does not display cart count when 0', () => {
		useSelector.mockReturnValue(0);
		render(
			<BrowserRouter>
				<Navigation variant="default" />
			</BrowserRouter>
		);
		expect(screen.queryByText('0')).not.toBeInTheDocument();
	});

	// Graph: Interaction
	test('navigates to profile on account icon click', () => {
		render(
			<BrowserRouter>
				<Navigation variant="default" />
			</BrowserRouter>
		);

		fireEvent.click(screen.getByTestId('account-icon').closest('button'));
		expect(mockNavigate).toHaveBeenCalledWith('/account-details/profile');
	});
});
