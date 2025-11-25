import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryTypeInput from './CategoryTypeInput';
import { useWatch } from 'react-hook-form';
import { useGetList } from 'react-admin';

// Mock Dependencies
jest.mock('react-hook-form', () => ({
	useWatch: jest.fn(),
}));
jest.mock('react-admin', () => ({
	useGetList: jest.fn(),
	SelectInput: ({ choices }) => (
		<select data-testid="select-input">
			{choices?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
		</select>
	),
	required: jest.fn(),
}));

describe('CategoryTypeInput Component', () => {
	const mockCategories = [
		{
			id: 'cat1',
			categoryTypes: [
				{ id: 'type1', name: 'Type 1' },
				{ id: 'type2', name: 'Type 2' }
			]
		},
		{
			id: 'cat2',
			categoryTypes: [
				{ id: 'type3', name: 'Type 3' }
			]
		}
	];

	beforeEach(() => {
		useGetList.mockReturnValue({ data: mockCategories });
	});

	// Graph: Data Flow
	test('renders choices based on selected category', () => {
		useWatch.mockReturnValue('cat1'); // Selected category ID

		render(<CategoryTypeInput />);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(screen.getByText('Type 1')).toBeInTheDocument();
		expect(screen.getByText('Type 2')).toBeInTheDocument();
	});

	test('renders no choices if no category selected', () => {
		useWatch.mockReturnValue(null);

		render(<CategoryTypeInput />);

		const options = screen.queryAllByRole('option');
		expect(options).toHaveLength(0);
	});
});
