import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Checkout from './Checkout';
import { fetchUserDetails } from '../../api/userInfo';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.unmock('../../store/features/common');
jest.mock('../../store/features/cart', () => ({
	selectCartItems: (state) => state.cart.cartItems
}));
jest.mock('../PaymentPage/PaymentPage', () => () => <div data-testid="payment-page">Payment Page</div>);

const mockStore = configureStore([]);

describe('Checkout Component', () => {
	let store;
	const mockCartItems = [
		{ id: 1, subTotal: 50 },
		{ id: 2, subTotal: 30 }
	];
	const mockUserInfo = {
		id: 1,
		addressList: [
			{ id: 1, name: 'John Doe', street: '123 St', city: 'City', state: 'State', zipCode: '12345' }
		]
	};

	beforeEach(() => {
		fetchUserDetails.mockResolvedValue(mockUserInfo);
		store = mockStore({
			cart: { cartItems: mockCartItems }
		});
	});

	// ISP: Rendering
	test('renders delivery address and order summary', async () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<Checkout />
				</BrowserRouter>
			</Provider>
		);

		expect(screen.getByText('Delivery address')).toBeInTheDocument();
		expect(screen.getByText('Order Summary')).toBeInTheDocument();
		expect(screen.getByText('Items Count = 2')).toBeInTheDocument();
		expect(screen.getByText('SubTotal = $80.00')).toBeInTheDocument(); // 50 + 30
	});

	// Graph: Payment Method Selection
	test('selects payment method and renders correct view', async () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<Checkout />
				</BrowserRouter>
			</Provider>
		);

		// Select Card
		const cardRadio = screen.getByDisplayValue('CARD');
		fireEvent.click(cardRadio);
		expect(screen.getByTestId('payment-page')).toBeInTheDocument();
		expect(screen.queryByText('Pay Now')).not.toBeInTheDocument();

		// Select COD
		const codRadio = screen.getByDisplayValue('COD');
		fireEvent.click(codRadio);
		expect(screen.queryByTestId('payment-page')).not.toBeInTheDocument();
		expect(screen.getByText('Pay Now')).toBeInTheDocument();
	});
});
