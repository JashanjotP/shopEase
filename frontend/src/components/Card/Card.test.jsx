import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

// Mock ArrowIcon since it's a child component
jest.mock('../common/ArrowIcon', () => () => <div data-testid="arrow-icon">ArrowIcon</div>);

describe('Card Component', () => {
	// ISP: Input Space Partitioning for props

	test('renders with all props provided', () => {
		render(
			<Card
				imagePath="/test-image.jpg"
				title="Test Title"
				description="Test Description"
				actionArrow={true}
				height="300px"
				width="250px"
			/>
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
		expect(screen.getByRole('img')).toHaveAttribute('height', '300px');
		expect(screen.getByRole('img')).toHaveAttribute('width', '250px');
		expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
	});

	test('renders with minimal props (defaults check)', () => {
		render(
			<Card
				imagePath="/test-image.jpg"
				title="Test Title"
			/>
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.queryByText('Test Description')).not.toBeInTheDocument(); // Description missing
		expect(screen.queryByTestId('arrow-icon')).not.toBeInTheDocument(); // Action arrow missing

		// Check defaults
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('height', '220px');
		expect(img).toHaveAttribute('width', '200px');
	});

	test('renders description only when provided (Graph: Branch coverage)', () => {
		const { rerender } = render(<Card imagePath="/img.jpg" title="Title" />);
		expect(screen.queryByText('Desc')).not.toBeInTheDocument();

		rerender(<Card imagePath="/img.jpg" title="Title" description="Desc" />);
		expect(screen.getByText('Desc')).toBeInTheDocument();
	});

	test('renders arrow icon only when actionArrow is true (Graph: Branch coverage)', () => {
		const { rerender } = render(<Card imagePath="/img.jpg" title="Title" actionArrow={false} />);
		expect(screen.queryByTestId('arrow-icon')).not.toBeInTheDocument();

		rerender(<Card imagePath="/img.jpg" title="Title" actionArrow={true} />);
		expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
	});
});
