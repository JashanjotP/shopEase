import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './Cart';
import { delteItemFromCartAction, updateItemToCartAction } from '../../store/actions/cartAction';
import { isTokenValid } from '../../utils/jwt-helper';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

jest.mock('../../store/actions/cartAction');
jest.mock('../../utils/jwt-helper');
jest.mock('react-modal', () => {
	const Modal = ({ isOpen, children }) => isOpen ? <div>{children}</div> : null;
	Modal.setAppElement = jest.fn();
	return Modal;
});

// Mock Components
jest.mock('../../components/NumberInput/NumberInput', () => ({
	NumberInput: ({ onChangeQuantity, quantity }) => (
		<input
			data-testid="number-input"
			type="number"
			value={quantity}
			onChange={(e) => onChangeQuantity(parseInt(e.target.value))}
		/>
	)
}));
jest.mock('../../components/common/DeleteIcon', () => () => <div data-testid="delete-icon">Delete</div>);

describe('Cart Component', () => {
	const mockDispatch = jest.fn();
	const mockNavigate = jest.fn();

	beforeEach(() => {
		useDispatch.mockReturnValue(mockDispatch);
		require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
		isTokenValid.mockReturnValue(true); // Default logged in
		mockDispatch.mockClear();
		mockNavigate.mockClear();
	});

	// ISP: Empty Cart
	test('renders empty cart state', () => {
		useSelector.mockReturnValue([]);
		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
		expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
	});

	// ISP: Populated Cart
	test('renders cart with items', () => {
		const mockCartItems = [
			{
				productId: 1,
				variant: { id: 101, size: 'M', color: 'Red' },
				name: 'Test Product',
				price: 50,
				quantity: 2,
				subTotal: 100,
				thumbnail: 'thumb.jpg'
			}
		];
		useSelector.mockReturnValue(mockCartItems);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		expect(screen.getByText('Shopping Bag')).toBeInTheDocument();
		expect(screen.getByText('Test Product')).toBeInTheDocument();
		expect(screen.getByText('$50')).toBeInTheDocument();
		expect(screen.getByText('$100')).toBeInTheDocument(); // Subtotal
		expect(screen.getByTestId('number-input')).toHaveValue(2);
	});

	// Graph: Interaction (Update Quantity)
	test('dispatches update action on quantity change', () => {
		const mockCartItems = [
			{
				productId: 1,
				variant: { id: 101 },
				quantity: 1,
				subTotal: 50
			}
		];
		useSelector.mockReturnValue(mockCartItems);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		const input = screen.getByTestId('number-input');
		fireEvent.change(input, { target: { value: '2' } });

		expect(mockDispatch).toHaveBeenCalled();
		expect(updateItemToCartAction).toHaveBeenCalledWith({
			productId: 1,
			variant_id: 101,
			quantity: 2
		});
	});

	// Graph: Interaction (Delete Item)
	test('opens modal and deletes item on confirmation', () => {
		const mockCartItems = [
			{
				productId: 1,
				variant: { id: 101 },
				quantity: 1,
				subTotal: 50
			}
		];
		useSelector.mockReturnValue(mockCartItems);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		// Click delete icon
		const deleteBtn = screen.getByTestId('delete-icon').closest('button');
		fireEvent.click(deleteBtn);

		// Modal should open
		expect(screen.getByText('Are you sure you want to remve this item ?')).toBeInTheDocument();

		// Confirm delete
		const confirmBtn = screen.getByText('Remove');
		fireEvent.click(confirmBtn);

		expect(mockDispatch).toHaveBeenCalled();
		expect(delteItemFromCartAction).toHaveBeenCalledWith({
			productId: 1,
			variantId: 101
		});
	});

	test('closes modal on cancel', () => {
		const mockCartItems = [{ productId: 1, variant: { id: 101 }, quantity: 1, subTotal: 50 }];
		useSelector.mockReturnValue(mockCartItems);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		// Open modal
		fireEvent.click(screen.getByTestId('delete-icon').closest('button'));
		expect(screen.getByText('Are you sure you want to remve this item ?')).toBeInTheDocument();

		// Click Cancel
		fireEvent.click(screen.getByText('Cancel'));

		// Modal content should disappear (mocked modal renders children if open)
		// Since we mocked Modal to render children when open, and null when closed
		expect(screen.queryByText('Are you sure you want to remve this item ?')).not.toBeInTheDocument();
	});

	// Graph: Auth State (Checkout Button)
	test('shows checkout button when logged in', () => {
		useSelector.mockReturnValue([{ subTotal: 10 }]);
		isTokenValid.mockReturnValue(true);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		expect(screen.getByText('Checkout')).toBeInTheDocument();
		expect(screen.queryByText('Login to Checkout')).not.toBeInTheDocument();

		// Test navigation
		fireEvent.click(screen.getByText('Checkout'));
		expect(mockNavigate).toHaveBeenCalledWith('/checkout');
	});

	test('shows login button when not logged in', () => {
		useSelector.mockReturnValue([{ subTotal: 10 }]);
		isTokenValid.mockReturnValue(false);

		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		expect(screen.getByText('Login to Checkout')).toBeInTheDocument();
		expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
	});

	// Graph: Coupon Section (Basic Interaction)
	test('renders coupon section and allows input', () => {
		useSelector.mockReturnValue([{ subTotal: 100 }]);
		render(
			<BrowserRouter>
				<Cart />
			</BrowserRouter>
		);

		expect(screen.getByText('Discount Coupon')).toBeInTheDocument();
		const input = screen.getByPlaceholderText('Enter code');
		fireEvent.change(input, { target: { value: 'SAVE10' } });
		expect(input.value).toBe('SAVE10');

		// Just checking button exists, functionality might not be implemented in component yet
		expect(screen.getByText('Apply')).toBeInTheDocument();
	});
});
