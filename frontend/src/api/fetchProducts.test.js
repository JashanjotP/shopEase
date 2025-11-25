import axios from 'axios';
import { getAllProducts } from './fetchProducts';
import { API_BASE_URL } from './constant';

jest.mock('axios', () => ({
	__esModule: true,
	default: jest.fn()
}));

describe('FetchProducts API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('getAllProducts should make a GET request', async () => {
		const mockData = [{ id: 1, name: 'Product 1' }];
		axios.mockResolvedValue({ data: mockData });

		const result = await getAllProducts(1);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/products?categoryId=1`, {
			method: 'GET'
		});
		expect(result).toEqual(mockData);
	});

	test('getAllProducts should handle error', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
		axios.mockRejectedValue(new Error('Failed'));
		await getAllProducts(1);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});
