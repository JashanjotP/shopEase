import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { thunk } from 'redux-thunk';
import ConfirmPayment from './ConfirmPayment';
import { confirmPaymentAPI } from '../../api/order';

// Mock Dependencies
jest.mock('../../api/order');
jest.unmock('../../store/features/common');
jest.mock('../../store/actions/cartAction', () => ({
	__esModule: true,
	clearCart: jest.fn(() => ({ type: 'cart/clearCart' }))
}));
jest.mock('../../components/Spinner/Spinner', () => () => <div data-testid="spinner">Spinner</div>);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ConfirmPayment Component', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			commonState: { loading: false }
		});
		confirmPaymentAPI.mockResolvedValue({ orderId: '123' });
		const { clearCart } = require('../../store/actions/cartAction');
		console.log('DEBUG: clearCart in test =', clearCart);
		console.log('DEBUG: clearCart() result =', clearCart());
	});

	// Graph: Successful Payment
	test('handles successful payment redirect', async () => {
		const search = '?payment_intent_client_secret=secret&redirect_status=succeeded&payment_intent=pi_123';

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={[`/confirmPayment${search}`]}>
					<Routes>
						<Route path="/confirmPayment" element={<ConfirmPayment />} />
						<Route path="/orderConfirmed" element={<div>Order Confirmed Page</div>} />
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText('Processing Payment...')).toBeInTheDocument();

		await waitFor(() => {
			expect(confirmPaymentAPI).toHaveBeenCalledWith({
				paymentIntent: 'pi_123',
				status: 'pi_123'
			});
			expect(screen.getByText('Order Confirmed Page')).toBeInTheDocument();
		});
	});

	// Graph: Failed Payment
	test('handles failed payment redirect', async () => {
		const search = '?redirect_status=failed';

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={[`/confirmPayment${search}`]}>
					<ConfirmPayment />
				</MemoryRouter>
			</Provider>
		);

		await waitFor(() => {
			expect(screen.getByText('Payment Failed - failed')).toBeInTheDocument();
		});
	});
});
