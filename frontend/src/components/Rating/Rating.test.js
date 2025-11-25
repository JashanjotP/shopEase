import React from 'react';
import { render, screen } from '@testing-library/react';
import Rating from './Rating';

// Mock Icons
jest.mock('../common/SvgStarIcon', () => () => <div data-testid="filled-star">Star</div>);
jest.mock('../common/SvgEmptyStar', () => ({ SvgEmptyStar: () => <div data-testid="empty-star">Empty</div> }));

describe('Rating Component', () => {
	// ISP: Rendering
	test('renders correct stars for integer rating', () => {
		render(<Rating rating={3} />);

		const filledStars = screen.getAllByTestId('filled-star');
		const emptyStars = screen.getAllByTestId('empty-star');

		expect(filledStars).toHaveLength(3);
		expect(emptyStars).toHaveLength(2);
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	test('renders correct stars for float rating (floors value)', () => {
		render(<Rating rating={3.5} />);

		const filledStars = screen.getAllByTestId('filled-star');
		// Math.floor(3.5) = 3 filled stars
		expect(filledStars).toHaveLength(3);
		// 5 - 3 = 2 empty stars
		const emptyStars = screen.getAllByTestId('empty-star');
		expect(emptyStars).toHaveLength(2);
		expect(screen.getByText('3.5')).toBeInTheDocument();
	});

	test('renders all empty stars for 0 rating', () => {
		render(<Rating rating={0} />);

		const emptyStars = screen.getAllByTestId('empty-star');
		expect(emptyStars).toHaveLength(5);
		expect(screen.queryByTestId('filled-star')).not.toBeInTheDocument();
	});

	test('renders all filled stars for 5 rating', () => {
		render(<Rating rating={5} />);

		const filledStars = screen.getAllByTestId('filled-star');
		expect(filledStars).toHaveLength(5);
		expect(screen.queryByTestId('empty-star')).not.toBeInTheDocument();
	});
});
