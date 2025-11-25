import { isTokenValid, saveToken, logOut, getToken } from './jwt-helper';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

describe('JWT Helper', () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	test('saveToken should save token to localStorage', () => {
		saveToken('test-token');
		expect(localStorage.getItem('authToken')).toBe('test-token');
	});

	test('getToken should retrieve token from localStorage', () => {
		localStorage.setItem('authToken', 'test-token');
		expect(getToken()).toBe('test-token');
	});

	test('logOut should remove token from localStorage', () => {
		localStorage.setItem('authToken', 'test-token');
		logOut();
		expect(localStorage.getItem('authToken')).toBeNull();
	});

	test('isTokenValid should return false if no token exists', () => {
		expect(isTokenValid()).toBe(false);
	});

	test('isTokenValid should return true if token is valid', () => {
		localStorage.setItem('authToken', 'valid-token');
		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Expires in 1 hour
		expect(isTokenValid()).toBe(true);
	});

	test('isTokenValid should return false if token is expired', () => {
		localStorage.setItem('authToken', 'expired-token');
		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 3600 }); // Expired 1 hour ago
		expect(isTokenValid()).toBe(false);
	});

	test('isTokenValid should return false if decoding fails', () => {
		localStorage.setItem('authToken', 'invalid-token');
		jwtDecode.mockImplementation(() => {
			throw new Error('Invalid token');
		});
		expect(isTokenValid()).toBe(false);
	});
});
