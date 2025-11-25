import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock icons
jest.mock('../common/FbIcon', () => () => <div data-testid="fb-icon">FbIcon</div>);
jest.mock('../common/InstaIcon', () => () => <div data-testid="insta-icon">InstaIcon</div>);

describe('Footer Component', () => {
	// ISP: Input Space Partitioning for 'content' prop

	test('renders with full content', () => {
		const content = {
			items: [
				{
					title: 'Section 1',
					list: [{ label: 'Link 1', path: '/link1' }],
					description: 'Description 1'
				},
				{
					title: 'Section 2',
					list: [{ label: 'Link 2', path: '/link2' }]
				}
			],
			copyright: '© 2024 ShopEase'
		};

		render(<Footer content={content} />);

		expect(screen.getByText('Section 1')).toBeInTheDocument();
		expect(screen.getByText('Link 1')).toBeInTheDocument();
		expect(screen.getByText('Description 1')).toBeInTheDocument();
		expect(screen.getByText('Section 2')).toBeInTheDocument();
		expect(screen.getByText('Link 2')).toBeInTheDocument();
		expect(screen.getByText('© 2024 ShopEase')).toBeInTheDocument();
		expect(screen.getByTestId('fb-icon')).toBeInTheDocument();
		expect(screen.getByTestId('insta-icon')).toBeInTheDocument();
	});

	test('renders with empty/null content (ISP & Robustness)', () => {
		render(<Footer content={null} />);

		// Should still render the container and static icons
		expect(screen.getByTestId('fb-icon')).toBeInTheDocument();
		expect(screen.getByTestId('insta-icon')).toBeInTheDocument();

		// Should not crash when accessing properties of null content
		// The component uses optional chaining content?.items
	});

	test('renders items without list or description (Graph: Branch coverage)', () => {
		const content = {
			items: [
				{ title: 'Just Title' }
			]
		};
		render(<Footer content={content} />);
		expect(screen.getByText('Just Title')).toBeInTheDocument();
	});
});
