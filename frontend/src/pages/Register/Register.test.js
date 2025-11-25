import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Register from './Register';
import { registerAPI } from '../../api/authentication';
import { setLoading } from '../../store/features/common';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useDispatch: jest.fn(),
}));

jest.mock('../../api/authentication');
jest.mock('../../components/Buttons/GoogleSignIn', () => () => <button>Google Sign In</button>);
jest.mock('./VerifyCode', () => ({ email }) => <div data-testid="verify-code">Verify Code for {email}</div>);

describe('Register Component', () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		useDispatch.mockReturnValue(mockDispatch);
		mockDispatch.mockClear();
		registerAPI.mockClear();
	});

	// ISP: Rendering
	test('renders registration form correctly', () => {
		render(
			<BrowserRouter>
				<Register />
			</BrowserRouter>
		);

		expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
	});

	// Graph: Successful Registration
	test('handles successful registration and switches to verification', async () => {
		registerAPI.mockResolvedValue({ code: 200 });

		render(
			<BrowserRouter>
				<Register />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'new@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

		const signUpBtn = screen.getByRole('button', { name: 'Sign Up' });
		fireEvent.click(signUpBtn);

		expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));

		await waitFor(() => {
			expect(registerAPI).toHaveBeenCalledWith(expect.objectContaining({
				email: 'new@example.com',
				password: 'password123'
			}));
			expect(screen.getByTestId('verify-code')).toBeInTheDocument();
			expect(screen.queryByText('Sign Up')).not.toBeInTheDocument(); // Form hidden
			expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
		});
	});

	// Graph: Failed Registration
	test('handles registration failure', async () => {
		registerAPI.mockRejectedValue(new Error('Exists'));

		render(
			<BrowserRouter>
				<Register />
			</BrowserRouter>
		);

		const signUpBtn = screen.getByRole('button', { name: 'Sign Up' });
		fireEvent.click(signUpBtn);

		await waitFor(() => {
			expect(screen.getByText('Invalid or Email already exist!')).toBeInTheDocument();
			expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
		});
	});
});
