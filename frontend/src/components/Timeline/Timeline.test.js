import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from './Timeline';

describe('Timeline Component', () => {
	// Graph: Step Coverage
	test('renders step 1 (Order Placed)', () => {
		render(<Timeline stepCount={1} />);
		expect(screen.getByText('Order Placed')).toBeInTheDocument();
		// Check visual indicators if possible, or just text presence
	});

	test('renders step 2 (In progress)', () => {
		render(<Timeline stepCount={2} />);
		expect(screen.getByText('In progress')).toBeInTheDocument();
	});

	test('renders step 3 (Shipped)', () => {
		render(<Timeline stepCount={3} />);
		expect(screen.getByText('Shipped')).toBeInTheDocument();
	});

	test('renders step 4 (Delivered)', () => {
		render(<Timeline stepCount={4} />);
		expect(screen.getByText('Delivered')).toBeInTheDocument();
	});
});
