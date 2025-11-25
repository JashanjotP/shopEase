import axios from 'axios';
import { fetchCategories } from './fetchCategories';
import { API_BASE_URL, API_URLS } from './constant';

jest.mock('axios', () => jest.fn());
jest.mock('./constant', () => ({
	API_BASE_URL: 'http://api.test',
	API_URLS: { GET_CATEGORIES: '/categories' }
}));

describe('fetchCategories API', () => {
	// ISP & Graph Coverage

	test('fetches categories successfully (Happy Path)', async () => {
		const mockData = [{ id: 1, name: 'Electronics' }];
		// Axios returns an object with a data property
		axios.mockResolvedValue({ data: mockData });

		const result = await fetchCategories();

		expect(axios).toHaveBeenCalledWith('http://api.test/categories', { method: 'GET' });
		expect(result).toEqual(mockData);
	});

	test('handles API error gracefully (Error Path)', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
		const error = new Error('Network Error');
		axios.mockRejectedValue(error);

		const result = await fetchCategories();

		expect(consoleSpy).toHaveBeenCalledWith(error);
		expect(result).toBeUndefined(); // Function returns undefined on error

		consoleSpy.mockRestore();
	});
});
