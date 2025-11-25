import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionHeading from './SectionHeading';

describe('SectionHeading Component', () => {
	// ISP: Rendering
	test('renders with title', () => {
		render(<SectionHeading title="Test Title" />);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});
});
