import axios from 'axios';
import { placeOrderAPI, confirmPaymentAPI } from './order';
import { API_BASE_URL } from './constant';

jest.mock('axios', () => ({
	__esModule: true,
	default: jest.fn()
}));
jest.mock('./constant', () => ({
	__esModule: true,
	API_BASE_URL: 'http://localhost:8080',
	getHeaders: () => ({ Authorization: 'Bearer token' })
}));

describe('Order API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('placeOrderAPI should make a POST request', async () => {
		const mockData = { orderId: 1 };
		axios.mockResolvedValue({ data: mockData });
		const body = { items: [] };

		const result = await placeOrderAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/order`, {
			method: 'POST',
			data: body,
			headers: { Authorization: 'Bearer token' }
		});
		expect(result).toEqual(mockData);
	});

	test('placeOrderAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(placeOrderAPI({})).rejects.toThrow('Error: Failed');
	});

	test('confirmPaymentAPI should make a POST request', async () => {
		const mockData = { success: true };
		axios.mockResolvedValue({ data: mockData });
		const body = { paymentId: '123' };

		const result = await confirmPaymentAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/order/update-payment`, {
			method: 'POST',
			data: body,
			headers: { Authorization: 'Bearer token' }
		});
		expect(result).toEqual(mockData);
	});

	test('confirmPaymentAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(confirmPaymentAPI({})).rejects.toThrow('Error: Failed');
	});
});
