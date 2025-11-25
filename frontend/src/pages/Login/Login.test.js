import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './Login';
import { loginAPI } from '../../api/authentication';
import { saveToken } from '../../utils/jwt-helper';
import { setLoading } from '../../store/features/common';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

jest.mock('../../api/authentication');
jest.mock('../../utils/jwt-helper');
jest.mock('../../components/Buttons/GoogleSignIn', () => () => <button>Google Sign In</button>);

describe('Login Component', () => {
	const mockDispatch = jest.fn();
	const mockNavigate = jest.fn();

	beforeEach(() => {
		useDispatch.mockReturnValue(mockDispatch);
		require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
		mockDispatch.mockClear();
		mockNavigate.mockClear();
		loginAPI.mockClear();
		saveToken.mockClear();
	});

	// ISP: Rendering
	test('renders login form correctly', () => {
		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByText('Google Sign In')).toBeInTheDocument();
	});

	// Graph: Successful Login
	test('handles successful login', async () => {
		loginAPI.mockResolvedValue({ token: 'fake-token' });

		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

		const signInBtn = screen.getByRole('button', { name: 'Sign In' });
		fireEvent.click(signInBtn);

		expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));

		await waitFor(() => {
			expect(loginAPI).toHaveBeenCalledWith({ userName: 'test@example.com', password: 'password123' });
			expect(saveToken).toHaveBeenCalledWith('fake-token');
			expect(mockNavigate).toHaveBeenCalledWith('/');
			expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
		});
	});

	// Graph: Failed Login (API Error)
	test('handles login failure (invalid credentials)', async () => {
		loginAPI.mockRejectedValue(new Error('Invalid Credentials'));

		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'wrong@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });

		const signInBtn = screen.getByRole('button', { name: 'Sign In' });
		fireEvent.click(signInBtn);

		await waitFor(() => {
			expect(screen.getByText('Invalid Credentials!')).toBeInTheDocument();
			expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
		});
	});

	// Graph: Failed Login (No Token)
	test('handles login failure (no token in response)', async () => {
		loginAPI.mockResolvedValue({}); // No token

		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

		await waitFor(() => {
			expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
		});
	});
});
