import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import AuthenticationWrapper from './AuthenticationWrapper';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
	Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));
jest.mock('../components/Navigation/Navigation', () => () => <div data-testid="navigation">Navigation</div>);
jest.mock('../components/Spinner/Spinner', () => () => <div data-testid="spinner">Spinner</div>);
jest.mock('../assets/img/bg-1.png', () => 'bg-image.png');

describe('AuthenticationWrapper Component', () => {
	// Graph: Loading State
	test('renders content without spinner when not loading', () => {
		useSelector.mockReturnValue(false); // isLoading = false

		render(<AuthenticationWrapper />);

		expect(screen.getByTestId('navigation')).toBeInTheDocument();
		expect(screen.getByTestId('outlet')).toBeInTheDocument();
		expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
		expect(screen.getByAltText('shoppingimage')).toBeInTheDocument();
	});

	test('renders spinner when loading', () => {
		useSelector.mockReturnValue(true); // isLoading = true

		render(<AuthenticationWrapper />);

		expect(screen.getByTestId('spinner')).toBeInTheDocument();
	});
});
