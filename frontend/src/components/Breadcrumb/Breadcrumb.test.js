import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb Component', () => {
	// ISP: Input Space Partitioning for 'links' prop

	test('renders nothing or empty list when links is null/undefined', () => {
		render(
			<BrowserRouter>
				<Breadcrumb links={null} />
			</BrowserRouter>
		);
		const listItems = screen.queryAllByRole('listitem');
		expect(listItems).toHaveLength(0);
	});

	test('renders nothing when links is an empty array', () => {
		render(
			<BrowserRouter>
				<Breadcrumb links={[]} />
			</BrowserRouter>
		);
		const listItems = screen.queryAllByRole('listitem');
		expect(listItems).toHaveLength(0);
	});

	test('renders single link correctly (Graph: Loop 1 iteration)', () => {
		const links = [{ title: 'Home', path: '/' }];
		render(
			<BrowserRouter>
				<Breadcrumb links={links} />
			</BrowserRouter>
		);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(screen.getByText('Home')).toBeInTheDocument();
		// Separator should not exist for the last item
		const separators = document.querySelectorAll('svg');
		expect(separators.length).toBe(0);
	});

	test('renders multiple links with separators (Graph: Loop > 1 iteration)', () => {
		const links = [
			{ title: 'Home', path: '/' },
			{ title: 'Products', path: '/products' },
			{ title: 'Details', path: '/products/1' }
		];
		render(
			<BrowserRouter>
				<Breadcrumb links={links} />
			</BrowserRouter>
		);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);
		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('Details')).toBeInTheDocument();

		// Check for separators (should be length - 1)
		// We can check for the svg icon which acts as separator
		// The component renders the svg inside the list item if it's not the last index
		// So we expect 2 SVGs
		// Note: The component uses a specific SVG class "rtl:rotate-180"
		const separators = document.getElementsByClassName('rtl:rotate-180');
		expect(separators.length).toBe(2);
	});

	test('handles missing title or path gracefully', () => {
		const links = [{ path: '/' }]; // Missing title
		render(
			<BrowserRouter>
				<Breadcrumb links={links} />
			</BrowserRouter>
		);
		const linkElement = screen.getByRole('link');
		expect(linkElement).toBeInTheDocument();
		// It might render empty text, just ensuring it doesn't crash
	});
});
