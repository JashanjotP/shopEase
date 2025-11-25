import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { isTokenValid } from '../../utils/jwt-helper';

// Mock Dependencies
jest.mock('../../utils/jwt-helper');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

describe('ProtectedRoute Component', () => {
	const mockNavigate = jest.fn();

	beforeEach(() => {
		require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
		mockNavigate.mockClear();
	});

	// Graph: Authenticated
	test('renders children when token is valid', () => {
		isTokenValid.mockReturnValue(true);

		render(
			<ProtectedRoute>
				<div data-testid="protected-content">Protected Content</div>
			</ProtectedRoute>
		);

		expect(screen.getByTestId('protected-content')).toBeInTheDocument();
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	// Graph: Unauthenticated
	test('redirects to login when token is invalid', () => {
		isTokenValid.mockReturnValue(false);

		render(
			<ProtectedRoute>
				<div data-testid="protected-content">Protected Content</div>
			</ProtectedRoute>
		);

		expect(mockNavigate).toHaveBeenCalledWith('/v1/login');
		// Children are still rendered in the DOM structure of the component, 
		// but navigation happens in useEffect. 
		// In a real app, navigation would unmount this, but in test environment we check the call.
	});
});
