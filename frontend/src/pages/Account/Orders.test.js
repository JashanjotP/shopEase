import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Orders from './Orders';
import { fetchOrderAPI, cancelOrderAPI } from '../../api/userInfo';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.unmock('../../store/features/common');
jest.mock('../../store/features/user', () => ({
	...jest.requireActual('../../store/features/user'),
	selectAllOrders: (state) => state.user.orders
}));
jest.mock('../../components/Timeline/Timeline', () => () => <div data-testid="timeline">Timeline</div>);
jest.mock('../../utils/order-util', () => ({
	getStepCount: { 'PENDING': 1, 'IN_PROGRESS': 2, 'SHIPPED': 3, 'DELIVERED': 4 }
}));

const mockStore = configureStore([]);

describe('Orders Component', () => {
	let store;
	const mockOrders = [
		{
			id: '1',
			orderDate: '2023-01-01',
			orderStatus: 'PENDING',
			totalAmount: 100,
			orderItemList: [
				{ id: 'i1', product: { name: 'Prod 1', price: 50 }, quantity: 2 }
			]
		}
	];

	beforeEach(() => {
		fetchOrderAPI.mockResolvedValue(mockOrders);
		store = mockStore({
			user: { orders: mockOrders }
		});
	});

	// ISP: Rendering
	test('renders orders list', async () => {
		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		expect(screen.getByText('My Orders')).toBeInTheDocument();
		expect(screen.getByText('Order no. #1')).toBeInTheDocument();
	});

	// Graph: Interaction
	test('view details and cancel order', async () => {
		cancelOrderAPI.mockResolvedValue({});

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// View Details
		fireEvent.click(screen.getByText('View Details'));
		expect(screen.getByText('Prod 1')).toBeInTheDocument();
		expect(screen.getByTestId('timeline')).toBeInTheDocument();

		// Cancel Order
		const cancelBtn = screen.getByText('Cancel Order');
		fireEvent.click(cancelBtn);

		await waitFor(() => {
			expect(cancelOrderAPI).toHaveBeenCalledWith('1');
		});
	});
	test('filters orders', async () => {
		const mixedOrders = [
			{ id: '1', orderDate: '2023-01-01', orderStatus: 'PENDING', totalAmount: 100, orderItemList: [] },
			{ id: '2', orderDate: '2023-01-02', orderStatus: 'CANCELLED', totalAmount: 200, orderItemList: [] },
			{ id: '3', orderDate: '2023-01-03', orderStatus: 'DELIVERED', totalAmount: 300, orderItemList: [] }
		];
		fetchOrderAPI.mockResolvedValue(mixedOrders);
		store = mockStore({
			user: { orders: mixedOrders }
		});

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// Default is ACTIVE (PENDING)
		expect(screen.getByText('Order no. #1')).toBeInTheDocument();
		expect(screen.queryByText('Order no. #2')).not.toBeInTheDocument();
		expect(screen.queryByText('Order no. #3')).not.toBeInTheDocument();

		// Filter Cancelled
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'CANCELLED' } });
		expect(screen.queryByText('Order no. #1')).not.toBeInTheDocument();
		expect(screen.getByText('Order no. #2')).toBeInTheDocument();

		// Filter Completed
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'COMPLETED' } });
		expect(screen.queryByText('Order no. #2')).not.toBeInTheDocument();
		expect(screen.getByText('Order no. #3')).toBeInTheDocument();
	});
});
