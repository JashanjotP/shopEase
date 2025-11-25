import store from './store';

describe('Redux Store', () => {
	test('should have the correct initial state', () => {
		const state = store.getState();
		expect(state).toHaveProperty('productState');
		expect(state).toHaveProperty('cartState');
		expect(state).toHaveProperty('categoryState');
		expect(state).toHaveProperty('commonState');
		expect(state).toHaveProperty('userState');
	});
});
