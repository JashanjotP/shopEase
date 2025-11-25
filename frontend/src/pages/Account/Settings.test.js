import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';
import { logOut } from '../../utils/jwt-helper';

// Mock Dependencies
jest.mock('../../utils/jwt-helper', () => ({
	logOut: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate
}));

describe('Settings Component', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
		logOut.mockClear();
	});

	test('renders logout button', () => {
		render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);
		expect(screen.getByText('Logout')).toBeInTheDocument();
	});

	test('calls logOut and navigates to home on click', () => {
		render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);

		fireEvent.click(screen.getByText('Logout'));

		expect(logOut).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
