import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Debug Store', () => {
	test('dispatches plain object action', () => {
		const store = mockStore({});
		store.dispatch({ type: 'TEST' });
		expect(store.getActions()).toEqual([{ type: 'TEST' }]);
	});

	test('dispatches thunk action', () => {
		const store = mockStore({});
		store.dispatch((dispatch) => {
			dispatch({ type: 'THUNK_ACTION' });
		});
		expect(store.getActions()).toEqual([{ type: 'THUNK_ACTION' }]);
	});

	test('mock action creator returns object', () => {
		const mockAction = jest.fn(() => ({ type: 'MOCK_ACTION' }));
		const store = mockStore({});
		store.dispatch(mockAction());
		expect(store.getActions()).toEqual([{ type: 'MOCK_ACTION' }]);
	});
});
