import axios from 'axios';
import { fetchUserDetails, addAddressAPI, deleteAddressAPI } from './userInfo';
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

describe('UserInfo API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('fetchUserDetails should make a GET request', async () => {
		const mockData = { name: 'John Doe' };
		axios.mockResolvedValue({ data: mockData });

		const result = await fetchUserDetails();

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/user/profile`, {
			method: 'GET',
			headers: { Authorization: 'Bearer token' }
		});
		expect(result).toEqual(mockData);
	});

	test('fetchUserDetails should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(fetchUserDetails()).rejects.toThrow('Error: Failed');
	});

	test('addAddressAPI should make a POST request', async () => {
		const mockData = { id: 1 };
		axios.mockResolvedValue({ data: mockData });
		const body = { street: '123 St' };

		const result = await addAddressAPI(body);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/address`, {
			method: 'POST',
			data: body,
			headers: { Authorization: 'Bearer token' }
		});
		expect(result).toEqual(mockData);
	});

	test('addAddressAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(addAddressAPI({})).rejects.toThrow('Error: Failed');
	});

	test('deleteAddressAPI should make a DELETE request', async () => {
		const mockData = { success: true };
		axios.mockResolvedValue({ data: mockData });
		const id = 1;

		const result = await deleteAddressAPI(id);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/address/${id}`, {
			method: 'DELETE',
			headers: { Authorization: 'Bearer token' }
		});
		expect(result).toEqual(mockData);
	});

	test('deleteAddressAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		await expect(deleteAddressAPI(1)).rejects.toThrow('Error: Failed');
	});
});
