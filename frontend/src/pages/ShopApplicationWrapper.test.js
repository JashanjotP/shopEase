import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import ShopApplicationWrapper from './ShopApplicationWrapper';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
	Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));
jest.mock('../components/Navigation/Navigation', () => () => <div data-testid="navigation">Navigation</div>);
jest.mock('../components/Spinner/Spinner', () => () => <div data-testid="spinner">Spinner</div>);

describe('ShopApplicationWrapper Component', () => {
	// Graph: Loading State
	test('renders content without spinner when not loading', () => {
		useSelector.mockReturnValue(false); // isLoading = false

		render(<ShopApplicationWrapper />);

		expect(screen.getByTestId('navigation')).toBeInTheDocument();
		expect(screen.getByTestId('outlet')).toBeInTheDocument();
		expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
	});

	test('renders spinner when loading', () => {
		useSelector.mockReturnValue(true); // isLoading = true

		render(<ShopApplicationWrapper />);

		expect(screen.getByTestId('spinner')).toBeInTheDocument();
	});
});
