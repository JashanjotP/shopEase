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
		store.dispatch = jest.fn(); // Spy on dispatch

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

		// Kill BlockStatement mutant (then block empty)
		expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
			type: 'userSlice/cancelOrder',
			payload: '1'
		}));

		// Kill finally block mutant (setLoading(false) missing)
		expect(store.dispatch).toHaveBeenCalledWith({ type: 'commonSlice/setLoading', payload: false });
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


	// Kill useState("Stryker was here!") (selectedOrder)
	test('initial state does not show order details', () => {
		// Use the specific ID that the mutant might use, or just ensure no details are shown
		// The mutant sets selectedOrder to "Stryker was here!"
		// We create an order with that ID to see if it shows up
		const mutantOrders = [{ ...mockOrders[0], id: 'Stryker was here!' }];
		store = mockStore({
			user: { orders: mutantOrders }
		});

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// If selectedOrder was "Stryker was here!", the details for this order would be visible.
		// We check that the details (e.g., product name) are NOT visible.
		expect(screen.queryByText('Prod 1')).not.toBeInTheDocument();
	});

	// Kill useState(["Stryker was here"]) (orders)
	test('initial render does not show orders list before effect runs', () => {
		// The mutant sets orders to ["Stryker was here"] initially.
		// This makes orders.length > 0 true immediately.
		// We want to ensure that initially (before useEffect updates state), nothing is shown.
		// However, useEffect runs after render.
		// If we pass empty orders in store, and mock fetch to return empty, 
		// correct code: orders=[], renders nothing.
		// mutant code: orders=["Stryker..."], renders "My Orders" header immediately.

		store = mockStore({
			user: { orders: [] }
		});
		// Hang the fetch to ensure we check state before it resolves
		fetchOrderAPI.mockImplementation(() => new Promise(() => { }));

		const { queryByText } = render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// Immediately after render, before effects have processed state updates from fetch
		// The "My Orders" header should NOT be present if orders is []
		// If orders is ["Stryker..."], it WILL be present.
		// Note: We need to be careful about the initial render vs re-render.
		// The component initializes state, then renders.
		expect(queryByText('My Orders')).not.toBeInTheDocument();
	});

	// Kill useEffect / dispatch mutants
	test('dispatches loading and fetches orders on mount', async () => {
		store.dispatch = jest.fn();
		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		expect(store.dispatch).toHaveBeenCalledWith({ type: 'commonSlice/setLoading', payload: true });
		await waitFor(() => {
			expect(fetchOrderAPI).toHaveBeenCalled();
		});
		// Verify specific action type to kill BlockStatement mutant (empty then block)
		expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
			type: 'userSlice/loadOrders'
		}));
		expect(store.dispatch).toHaveBeenCalledWith({ type: 'commonSlice/setLoading', payload: false });
	});

	// Kill StringLiteral mutant (date format)
	test('renders formatted order date', () => {
		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);
		// Kill moment().format("") mutant
		expect(screen.getByText(/January 01 2023/)).toBeInTheDocument();
		// Kill moment().add(3, 'days') mutant
		expect(screen.getByText(/Expected Delivery Date: January 04 2023/)).toBeInTheDocument();
	});

	// Kill ArrayDeclaration mutant (useEffect dependency [allOrders] -> [])
	test('updates orders list when store state changes', () => {
		const { rerender } = render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		expect(screen.getByText('Order no. #1')).toBeInTheDocument();

		// Update store with new order
		const newOrders = [
			...mockOrders,
			{ id: '2', orderDate: '2023-02-01', orderStatus: 'PENDING', totalAmount: 200, orderItemList: [] }
		];
		store = mockStore({
			user: { orders: newOrders }
		});

		// Rerender with new store state
		rerender(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// If dependency was [], this wouldn't update
		expect(screen.getByText('Order no. #2')).toBeInTheDocument();
	});

	// Kill OptionalChaining mutants (property access on order)
	test('handles null items and deep missing properties gracefully', () => {
		// This kills order?.id vs order.id etc.
		const complexNullOrders = [
			null,
			{
				id: '1',
				orderDate: '2023-01-01',
				orderStatus: 'PENDING',
				totalAmount: 100,
				orderItemList: null // Kill order.items.map
			},
			{
				id: '2',
				orderDate: '2023-01-01',
				orderStatus: 'PENDING', // Needs to be active to render
				totalAmount: 100,
				orderItemList: [
					null,
					{ id: 'i1', product: null, quantity: 1 },
					{ id: 'i2', product: { resources: null }, quantity: 1 },
					{ id: 'i3', product: { resources: [] }, quantity: 1 }
				]
			}
		];

		store = mockStore({
			user: { orders: complexNullOrders }
		});
		fetchOrderAPI.mockResolvedValue(complexNullOrders);

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// Should render valid orders
		expect(screen.getByText('Order no. #1')).toBeInTheDocument();
		expect(screen.getByText('Order no. #2')).toBeInTheDocument();

		// View Details for Order 2 (has items)
		const viewButtons = screen.getAllByText('View Details');
		fireEvent.click(viewButtons[1]); // Order 2

		// Should render fallbacks
		expect(screen.getAllByText('Name')).toHaveLength(4);
	});

	// Kill StringLiteral mutant (orderItem?.name || 'Name')
	test('displays default name for missing product name', async () => {
		const orderWithMissingName = [{
			id: '1',
			orderDate: '2023-01-01',
			orderStatus: 'PENDING',
			totalAmount: 100,
			orderItemList: [
				{ id: 'i1', product: { name: null, price: 50 }, quantity: 2 }
			]
		}];

		store = mockStore({
			user: { orders: orderWithMissingName }
		});
		fetchOrderAPI.mockResolvedValue(orderWithMissingName);

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// View Details
		fireEvent.click(screen.getByText('View Details'));
		// Should show 'Name' fallback
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	// Kill StringLiteral mutant (setSelectedOrder('') -> "Stryker was here!")
	test('hides details correctly even if state becomes non-empty string', async () => {
		// If the mutant sets selectedOrder to "Stryker was here!", and we have an order with that ID,
		// the details for THAT order would show up.
		// So we create a scenario where we have an order with ID "Stryker was here!".
		// We open order #1. Then click Hide.
		// If correct: selectedOrder becomes ''. No details shown.
		// If mutant: selectedOrder becomes "Stryker was here!". Details for "Stryker was here!" show up.

		const mutantId = "Stryker was here!";
		const orders = [
			{ id: '1', orderDate: '2023-01-01', orderStatus: 'PENDING', totalAmount: 100, orderItemList: [] },
			{ id: mutantId, orderDate: '2023-01-01', orderStatus: 'PENDING', totalAmount: 100, orderItemList: [{ id: 'm1', product: { name: 'Mutant Product' }, quantity: 1 }] }
		];

		store = mockStore({
			user: { orders: orders }
		});
		fetchOrderAPI.mockResolvedValue(orders);

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// Open Order 1
		const viewButtons = screen.getAllByText('View Details');
		fireEvent.click(viewButtons[0]); // Click first one (Order 1)

		// Verify Order 1 details are shown
		expect(screen.getByText('Hide Details')).toBeInTheDocument();

		// Click Hide Details
		fireEvent.click(screen.getByText('Hide Details'));

		// If mutant is active, selectedOrder becomes "Stryker was here!".
		// So details for the mutant order (containing "Mutant Product") would appear.
		expect(screen.queryByText('Mutant Product')).not.toBeInTheDocument();
	});

	test('handles order with missing fields', async () => {
		// We need orderStatus to be one of the active statuses for it to show up in the default list
		const incompleteOrders = [{ id: '99', orderStatus: 'PENDING' }];
		fetchOrderAPI.mockResolvedValue(incompleteOrders);
		store = mockStore({
			user: { orders: incompleteOrders }
		});

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// Should render without crashing
		expect(screen.getByText('Order no. #99')).toBeInTheDocument();
		// Check default values or absence of missing fields if applicable
		// e.g., status might default or be empty
	});

	// Kill ConditionalExpression mutants (Status Mapping)
	test('maps all order statuses correctly', async () => {
		const statuses = [
			{ status: 'PENDING', expected: 'ACTIVE' },
			{ status: 'IN_PROGRESS', expected: 'ACTIVE' },
			{ status: 'SHIPPED', expected: 'ACTIVE' },
			{ status: 'DELIVERED', expected: 'COMPLETED' },
			{ status: 'CANCELLED', expected: 'CANCELLED' }, // Fallback case
			{ status: 'UNKNOWN', expected: 'UNKNOWN' }       // Fallback case
		];

		const ordersWithStatuses = statuses.map((s, i) => ({
			id: `status-${i}`,
			orderStatus: s.status,
			orderDate: '2023-01-01',
			totalAmount: 100
		}));

		fetchOrderAPI.mockResolvedValue(ordersWithStatuses);
		store = mockStore({
			user: { orders: ordersWithStatuses }
		});

		render(
			<Provider store={store}>
				<Orders />
			</Provider>
		);

		// We need to check if they are filtered correctly or just check the mapped status if visible?
		// The component maps status in `displayOrders`.
		// But the UI filters based on `selectedFilter` vs `order.status`.
		// So we can check if they appear under the correct filter.

		// 'ACTIVE' filter is default
		expect(screen.getByText('Order no. #status-0')).toBeInTheDocument(); // PENDING
		expect(screen.getByText('Order no. #status-1')).toBeInTheDocument(); // IN_PROGRESS
		expect(screen.getByText('Order no. #status-2')).toBeInTheDocument(); // SHIPPED

		// Switch to COMPLETED
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'COMPLETED' } });
		expect(screen.getByText('Order no. #status-3')).toBeInTheDocument(); // DELIVERED

		// Switch to CANCELLED (which seems to be the fallback for anything else in the filter logic? No, filter checks `order.status === selectedFilter`)
		// Wait, the component logic:
		// status: (PENDING || IN_PROGRESS || SHIPPED) ? 'ACTIVE' : (DELIVERED ? 'COMPLETED' : orderStatus)
		// So CANCELLED -> CANCELLED.
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'CANCELLED' } });
		expect(screen.getByText('Order no. #status-4')).toBeInTheDocument(); // CANCELLED
	});
});
