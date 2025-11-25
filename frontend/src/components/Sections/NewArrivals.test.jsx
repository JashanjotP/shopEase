import React from 'react';
import { render, screen } from '@testing-library/react';
import NewArrivals from './NewArrivals';

// Mock Dependencies
jest.mock('./SectionsHeading/SectionHeading', () => ({ title }) => <h1>{title}</h1>);
jest.mock('../Card/Card', () => ({ title }) => <div data-testid="card">{title}</div>);
jest.mock('react-multi-carousel', () => ({ children }) => <div data-testid="carousel">{children}</div>);

// Mock Images
jest.mock('../../assets/img/jeans.jpg', () => 'jeans.jpg');
jest.mock('../../assets/img/shirts.jpg', () => 'shirts.jpg');
jest.mock('../../assets/img/tshirts.jpeg', () => 'tshirts.jpg');
jest.mock('../../assets/img/dresses.jpg', () => 'dresses.jpg');

describe('NewArrivals Component', () => {
	// ISP: Rendering
	test('renders section heading and carousel', () => {
		render(<NewArrivals />);

		expect(screen.getByRole('heading', { name: 'New Arrivals' })).toBeInTheDocument();
		expect(screen.getByTestId('carousel')).toBeInTheDocument();
	});

	// Graph: Content
	test('renders correct number of cards', () => {
		render(<NewArrivals />);

		const cards = screen.getAllByTestId('card');
		// items array has 6 items
		expect(cards).toHaveLength(6);

		// Verify some titles
		expect(screen.getByText('Jeans')).toBeInTheDocument();
		expect(screen.getByText('Shirts')).toBeInTheDocument();
		expect(screen.getByText('Kurtis')).toBeInTheDocument();
	});
});
