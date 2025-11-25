import React from 'react';
import { render, screen } from '@testing-library/react';
import Category from './Category';

// Mock Dependencies
jest.mock('../SectionsHeading/SectionHeading', () => ({ title }) => <h1>{title}</h1>);
jest.mock('../../Card/Card', () => ({ title }) => <div data-testid="card">{title}</div>);

describe('Category Component', () => {
	// ISP: Rendering
	test('renders with title and data items', () => {
		const mockData = [
			{ title: 'Item 1', description: 'Desc 1', image: 'img1.jpg' },
			{ title: 'Item 2', description: 'Desc 2', image: 'img2.jpg' }
		];

		render(<Category title="Test Category" data={mockData} />);

		expect(screen.getByRole('heading', { name: 'Test Category' })).toBeInTheDocument();
		const cards = screen.getAllByTestId('card');
		expect(cards).toHaveLength(2);
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
	});

	test('renders without data (graceful handling)', () => {
		render(<Category title="Empty Category" />);

		expect(screen.getByRole('heading', { name: 'Empty Category' })).toBeInTheDocument();
		expect(screen.queryByTestId('card')).not.toBeInTheDocument();
	});
});
