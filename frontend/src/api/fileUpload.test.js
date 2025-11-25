import axios from 'axios';
import { fileUploadAPI } from './fileUpload';
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

describe('FileUpload API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('fileUploadAPI should make a POST request', async () => {
		const mockData = { url: 'http://example.com/image.jpg' };
		axios.mockResolvedValue({ data: mockData });
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const formData = new FormData();
		formData.append('file', file);

		const result = await fileUploadAPI(formData);

		expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/file`, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: 'Bearer token'
			},
			data: formData
		});
		expect(result).toEqual(mockData);
	});

	test('fileUploadAPI should throw error on failure', async () => {
		axios.mockRejectedValue(new Error('Failed'));
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const formData = new FormData();
		formData.append('file', file);
		await expect(fileUploadAPI(formData)).rejects.toThrow('Error: Failed');
	});
});
