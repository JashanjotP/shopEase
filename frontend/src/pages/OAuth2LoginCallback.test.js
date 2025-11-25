import React from 'react';
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import OAuth2LoginCallback from './OAuth2LoginCallback';
import { saveToken } from '../utils/jwt-helper';

// Mock Dependencies
jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
}));
jest.mock('../utils/jwt-helper', () => ({
	saveToken: jest.fn(),
}));

describe('OAuth2LoginCallback Component', () => {
	const mockNavigate = jest.fn();

	beforeEach(() => {
		useNavigate.mockReturnValue(mockNavigate);
		mockNavigate.mockClear();
		saveToken.mockClear();

		// Mock window.location
		delete window.location;
		window.location = { search: '' };
	});

	// Graph: Success Path
	test('extracts token and navigates to home', () => {
		window.location.search = '?token=test-token';

		render(<OAuth2LoginCallback />);

		expect(saveToken).toHaveBeenCalledWith('test-token');
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	// Graph: Failure Path
	test('redirects to login if token is missing', () => {
		window.location.search = ''; // No token

		render(<OAuth2LoginCallback />);

		expect(saveToken).not.toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/v1/login');
	});
});
