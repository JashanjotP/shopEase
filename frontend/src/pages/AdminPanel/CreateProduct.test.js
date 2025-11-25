import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateProduct from './CreateProduct';

// Mock react-admin components
jest.mock('react-admin', () => ({
	Create: ({ children }) => <div data-testid="create">{children}</div>,
	SimpleForm: ({ children }) => <form data-testid="simple-form">{children}</form>,
	TextInput: ({ source }) => <input data-testid={`input-${source}`} />,
	NumberInput: ({ source }) => <input type="number" data-testid={`input-${source}`} />,
	ReferenceInput: ({ source }) => <div data-testid={`ref-${source}`} />,
	ImageInput: ({ source }) => <div data-testid={`img-${source}`} />,
	ImageField: () => null,
	ArrayInput: ({ source }) => <div data-testid={`array-${source}`} />,
	SimpleFormIterator: () => null,
	BooleanInput: ({ source }) => <input type="checkbox" data-testid={`bool-${source}`} />,
	required: jest.fn(),
	SelectInput: () => null,
	SelectField: () => null,
}));

jest.mock('./Category/CategoryTypeInput', () => () => <div data-testid="category-type-input" />);
jest.mock('../../components/Filters/ColorsFilter', () => ({ colorSelector: {} }));

describe('CreateProduct Component', () => {
	// ISP: Rendering
	test('renders create form with inputs', () => {
		render(<CreateProduct />);

		expect(screen.getByTestId('create')).toBeInTheDocument();
		expect(screen.getByTestId('simple-form')).toBeInTheDocument();
		expect(screen.getByTestId('input-name')).toBeInTheDocument();
		expect(screen.getByTestId('input-price')).toBeInTheDocument();
		expect(screen.getByTestId('category-type-input')).toBeInTheDocument();
	});
});
