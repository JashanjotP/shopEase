import axios from 'axios';
import { loginAPI, registerAPI, verifyAPI } from './authentication';
import { API_BASE_URL } from './constant';

jest.mock('axios', () => ({
	__esModule: true,
	default: jest.fn()
}));

describe('Authentication API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('loginAPI should make a POST request', async () => {
		const mockData = { token: '123' };
		axios.mockResolvedValue({ data: mockData });
		const body = { email: 'test@example.com', password: 'password' };

		const result = await loginAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/login`, {
			method: 'POST',
			data: body
		});
		expect(result).toEqual(mockData);
	});

	test('loginAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(loginAPI({})).rejects.toThrow('Error: Failed');
	});

	test('registerAPI should make a POST request', async () => {
		const mockData = { success: true };
		axios.mockResolvedValue({ data: mockData });
		const body = { email: 'test@example.com', password: 'password' };

		const result = await registerAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/register`, {
			method: 'POST',
			data: body
		});
		expect(result).toEqual(mockData);
	});

	test('registerAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(registerAPI({})).rejects.toThrow('Error: Failed');
	});

	test('verifyAPI should make a POST request', async () => {
		const mockData = { success: true };
		axios.mockResolvedValue({ data: mockData });
		const body = { email: 'test@example.com', code: '123456' };

		const result = await verifyAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/verify`, {
			method: 'POST',
			data: body
		});
		expect(result).toEqual(mockData);
	});

	test('verifyAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(verifyAPI({})).rejects.toThrow('Error: Failed');
	});
});
