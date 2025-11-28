import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateProduct from './CreateProduct';

// Mock react-admin components
jest.mock('react-admin', () => ({
    Create: ({ children }) => <div data-testid="create">{children}</div>,
    SimpleForm: ({ children }) => <form data-testid="simple-form">{children}</form>,
    // Mock TextInput to expose validation count
    TextInput: ({ source, validate }) => (
        <input 
            data-testid={`input-${source}`} 
            data-validate-count={validate ? validate.length : 0} 
        />
    ),
    // Mock NumberInput to expose validation count
    NumberInput: ({ source, validate }) => (
        <input 
            type="number" 
            data-testid={`input-${source}`} 
            data-validate-count={validate ? validate.length : 0} 
        />
    ),
    ReferenceInput: ({ source }) => <div data-testid={`ref-${source}`} />,
    ImageInput: ({ source }) => <div data-testid={`img-${source}`} />,
    ImageField: () => null,
    ArrayInput: ({ source, children }) => <div data-testid={`array-${source}`}>{children}</div>,
    // Render children so nested inputs exist in the DOM
    SimpleFormIterator: ({ children }) => <div data-testid="iterator">{children}</div>,
    BooleanInput: ({ source }) => <input type="checkbox" data-testid={`bool-${source}`} />,
    required: jest.fn(),
    // Mock SelectInput to expose choices count
    SelectInput: ({ source, choices }) => (
        <select 
            data-testid={`select-${source}`} 
            data-choices-count={choices ? choices.length : 0}
        />
    ),
    SelectField: () => null,
}));

jest.mock('./Category/CategoryTypeInput', () => () => <div data-testid="category-type-input" />);
jest.mock('../../components/Filters/ColorsFilter', () => ({ colorSelector: { Red: 'red', Blue: 'blue' } }));

describe('CreateProduct Component', () => {
    test('renders inputs with correct validation rules', () => {
        render(<CreateProduct />);

        // Handle the duplicate 'name' inputs
        // Index 0 = Product Name
        // Index 1 = Resource Name
        const nameInputs = screen.getAllByTestId('input-name');

        // 1. Kill mutant on Product Name (Line 12)
        expect(nameInputs[0]).toHaveAttribute('data-validate-count', '1');

        // 2. Kill mutant on Resource Name (Line 35)
        expect(nameInputs[1]).toHaveAttribute('data-validate-count', '1');

        // 3. Kill mutants on other unique fields
        expect(screen.getByTestId('input-slug')).toHaveAttribute('data-validate-count', '1');
        expect(screen.getByTestId('input-description')).toHaveAttribute('data-validate-count', '1');
        expect(screen.getByTestId('input-brand')).toHaveAttribute('data-validate-count', '1');
        
        // 4. Kill mutant on 'price' (NumberInput)
        expect(screen.getByTestId('input-price')).toHaveAttribute('data-validate-count', '1');
    });

    test('renders nested inputs with correct configuration', () => {
        render(<CreateProduct />);

        // 5. Kill mutant on nested SelectInput (choices={["image"]})
        const typeSelect = screen.getByTestId('select-type');
        expect(typeSelect).toBeInTheDocument();
        expect(typeSelect).toHaveAttribute('data-choices-count', '1');
    });
});