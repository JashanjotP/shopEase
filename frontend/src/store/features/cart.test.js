import cartReducer, {
	addToCart,
	removeFromCart,
	updateQuantity,
	deleteCart,
	countCartItems,
	selectCartItems
} from './cart';

describe('Cart Slice', () => {
	const initialState = { cart: [] };

	test('should return the initial state', () => {
		expect(cartReducer(undefined, {})).toEqual(initialState);
	});

	test('should handle addToCart', () => {
		const item = { id: 1, name: 'Product 1' };
		expect(cartReducer(initialState, addToCart(item))).toEqual({
			cart: [item]
		});
	});

	test('should handle removeFromCart', () => {
		const item = { id: 1, variant: { id: 1 } };
		const stateWithItem = { cart: [item] };
		expect(cartReducer(stateWithItem, removeFromCart({ productId: 1, variantId: 1 }))).toEqual({
			cart: []
		});
	});

	test('should handle updateQuantity', () => {
		const item = { id: 1, price: 10, variant: { id: 1 }, quantity: 1 };
		const stateWithItem = { cart: [item] };
		const payload = { variant_id: 1, quantity: 2 };
		const expectedState = {
			cart: [{ ...item, quantity: 2, subTotal: 20 }]
		};
		expect(cartReducer(stateWithItem, updateQuantity(payload))).toEqual(expectedState);
	});

	test('should handle deleteCart', () => {
		const stateWithItems = { cart: [{ id: 1 }] };
		expect(cartReducer(stateWithItems, deleteCart())).toEqual({
			cart: []
		});
	});

	test('selectors should work correctly', () => {
		const state = {
			cartState: {
				cart: [{ id: 1 }, { id: 2 }]
			}
		};
		expect(countCartItems(state)).toBe(2);
		expect(selectCartItems(state)).toEqual(state.cartState.cart);
	});
});
