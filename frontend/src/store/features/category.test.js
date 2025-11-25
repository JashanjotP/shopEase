import categoryReducer, { loadCategories, initialState } from './category';

describe('Category Slice', () => {
	test('should return the initial state', () => {
		expect(categoryReducer(undefined, {})).toEqual(initialState);
	});

	test('should handle loadCategories', () => {
		const categories = [{ id: 1, name: 'Electronics' }];
		expect(categoryReducer(initialState, loadCategories(categories))).toEqual({
			categories: categories
		});
	});
});
