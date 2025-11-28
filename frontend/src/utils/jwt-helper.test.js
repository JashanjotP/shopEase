import { isTokenValid, saveToken, logOut, getToken } from './jwt-helper';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

describe('JWT Helper', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        // Restore Date.now if it was mocked in previous tests
        jest.restoreAllMocks();
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

    // --- FIX FOR MUTANT 1 ---
    test('isTokenValid should return false if no token exists', () => {
        expect(isTokenValid()).toBe(false);
        // Ensure we exited early and didn't try to decode a null token
        expect(jwtDecode).not.toHaveBeenCalled();
    });

    test('isTokenValid should return true if token is valid', () => {
        localStorage.setItem('authToken', 'valid-token');
        jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); 
        expect(isTokenValid()).toBe(true);
    });

    test('isTokenValid should return false if token is expired', () => {
        localStorage.setItem('authToken', 'expired-token');
        jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 3600 }); 
        expect(isTokenValid()).toBe(false);
    });

    test('isTokenValid should return false if decoding fails', () => {
        localStorage.setItem('authToken', 'invalid-token');
        jwtDecode.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        expect(isTokenValid()).toBe(false);
    });

    // --- FIX FOR MUTANT 2 ---
    test('isTokenValid should return false if token expires at the exact current second (boundary check)', () => {
        const mockTimeSeconds = 1600000000;
        // Mock Date.now to return milliseconds
        jest.spyOn(Date, 'now').mockReturnValue(mockTimeSeconds * 1000);

        localStorage.setItem('authToken', 'boundary-token');
        
        // Expiration matches current time exactly
        jwtDecode.mockReturnValue({ exp: mockTimeSeconds }); 

        // Strictly > means this should be false. 
        // If it becomes >= (mutant), this will be true and fail the test.
        expect(isTokenValid()).toBe(false);
    });
});