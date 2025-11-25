import productReducer, { addProduct, loadProducts } from './product';

describe('Product Slice', () => {
	const initialState = { products: [] };

	test('should return the initial state', () => {
		expect(productReducer(undefined, {})).toEqual(initialState);
	});

	test('should handle addProduct', () => {
		const product = { id: 1, name: 'Test Product' };
		expect(productReducer(initialState, addProduct(product))).toEqual({
			products: [product]
		});
	});

	test('should handle loadProducts', () => {
		const products = [{ id: 1, name: 'Test Product' }];
		expect(productReducer(initialState, loadProducts(products))).toEqual({
			products: products
		});
	});
});
