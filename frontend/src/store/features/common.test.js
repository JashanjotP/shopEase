import commonReducer, { setLoading, initialState } from './common';

describe('Common Slice', () => {
	test('should return the initial state', () => {
		expect(commonReducer(undefined, {})).toEqual(initialState);
	});

	test('should handle setLoading', () => {
		const previousState = { loading: false };
		expect(commonReducer(previousState, setLoading(true))).toEqual({
			loading: true
		});
		expect(commonReducer({ loading: true }, setLoading(false))).toEqual({
			loading: false
		});
	});
});
