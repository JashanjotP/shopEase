import userReducer, {
	loadUserInfo,
	saveAddress,
	removeAddress,
	loadOrders,
	cancelOrder,
	initialState,
	selectUserInfo,
	selectAllOrders,
	selectIsUserAdmin
} from './user';

describe('User Slice', () => {
	test('should return the initial state', () => {
		expect(userReducer(undefined, {})).toEqual(initialState);
	});

	test('should handle loadUserInfo', () => {
		const userInfo = { id: 1, name: 'John Doe' };
		expect(userReducer(initialState, loadUserInfo(userInfo))).toEqual({
			...initialState,
			userInfo
		});
	});

	test('should handle saveAddress', () => {
		const address = { id: 1, street: '123 St' };
		const stateWithUserInfo = {
			...initialState,
			userInfo: { addressList: [] }
		};
		const expectedState = {
			...initialState,
			userInfo: { addressList: [address] }
		};
		expect(userReducer(stateWithUserInfo, saveAddress(address))).toEqual(expectedState);
	});

	test('should handle removeAddress', () => {
		const address = { id: 1, street: '123 St' };
		const stateWithAddress = {
			...initialState,
			userInfo: { addressList: [address] }
		};
		expect(userReducer(stateWithAddress, removeAddress(1))).toEqual({
			...initialState,
			userInfo: { addressList: [] }
		});
	});

	test('should handle loadOrders', () => {
		const orders = [{ id: 1, total: 100 }];
		expect(userReducer(initialState, loadOrders(orders))).toEqual({
			...initialState,
			orders
		});
	});

	test('should handle cancelOrder', () => {
		const orders = [{ id: 1, orderStatus: 'PENDING' }];
		const stateWithOrders = { ...initialState, orders };
		expect(userReducer(stateWithOrders, cancelOrder(1))).toEqual({
			...initialState,
			orders: [{ id: 1, orderStatus: 'CANCELLED' }]
		});
	});

	test('selectors should work correctly', () => {
		const state = {
			userState: {
				userInfo: {
					id: 1,
					authorityList: [{ roleCode: 'ADMIN', authority: 'ADMIN' }]
				},
				orders: [{ id: 1 }]
			}
		};
		expect(selectUserInfo(state)).toEqual(state.userState.userInfo);
		expect(selectAllOrders(state)).toEqual(state.userState.orders);
		expect(selectIsUserAdmin(state)).toBe(true);
	});
});
