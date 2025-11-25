import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
	// ISP: Rendering
	test('renders spinner', () => {
		render(<Spinner />);
		// The spinner has "Loading..." text for screen readers
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});
});
