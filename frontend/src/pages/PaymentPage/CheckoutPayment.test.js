import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CheckoutForm from './CheckoutPayment';
import { placeOrderAPI } from '../../api/order';
import { useStripe, useElements } from '@stripe/react-stripe-js';

jest.mock('../../api/order');
jest.unmock('../../store/features/common');
jest.mock('../../store/features/cart', () => ({
	selectCartItems: (state) => state.cart.cartItems
}));
jest.mock('../../utils/order-util', () => ({
	createOrderRequest: jest.fn(() => ({}))
}));
jest.mock('@stripe/react-stripe-js', () => ({
	useStripe: jest.fn(),
	useElements: jest.fn(),
	PaymentElement: () => <div data-testid="payment-element">Payment Element</div>
}));

const mockStore = configureStore([]);

describe('CheckoutForm Component', () => {
	let store;
	const mockStripe = {
		confirmPayment: jest.fn()
	};
	const mockElements = {
		submit: jest.fn()
	};

	beforeEach(() => {
		store = mockStore({
			cart: { cartItems: [] }
		});
		useStripe.mockReturnValue(mockStripe);
		useElements.mockReturnValue(mockElements);
		placeOrderAPI.mockResolvedValue({ credentials: { client_secret: 'secret' } });
		mockStripe.confirmPayment.mockResolvedValue({});
		mockElements.submit.mockResolvedValue({ error: null });
	});

	// ISP: Rendering
	test('renders payment form', () => {
		render(
			<Provider store={store}>
				<CheckoutForm userId="1" addressId="1" />
			</Provider>
		);

		expect(screen.getByTestId('payment-element')).toBeInTheDocument();
		expect(screen.getByText('Pay Now')).toBeInTheDocument();
	});

	// Graph: Form Submission
	test('submits form and places order', async () => {
		render(
			<Provider store={store}>
				<CheckoutForm userId="1" addressId="1" />
			</Provider>
		);

		fireEvent.submit(screen.getByRole('button', { name: 'Pay Now' }));

		await waitFor(() => {
			expect(mockElements.submit).toHaveBeenCalled();
			expect(placeOrderAPI).toHaveBeenCalled();
			expect(mockStripe.confirmPayment).toHaveBeenCalled();
		});
	});

	test('handles submission error', async () => {
		mockElements.submit.mockResolvedValue({ error: { message: 'Payment failed' } });

		render(
			<Provider store={store}>
				<CheckoutForm userId="1" addressId="1" />
			</Provider>
		);

		fireEvent.submit(screen.getByRole('button', { name: 'Pay Now' }));

		await waitFor(() => {
			expect(screen.getByText('Payment failed')).toBeInTheDocument();
			expect(placeOrderAPI).not.toHaveBeenCalled();
		});
	});
});
