import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NumberInput } from './NumberInput';

describe('NumberInput Component', () => {
	// ISP: Rendering with default props
	test('renders with default props', () => {
		render(<NumberInput />);
		const input = screen.getByRole('textbox'); // Input type="text" in code, though logically number
		expect(input).toHaveValue('1');
	});

	// ISP: Rendering with custom props
	test('renders with custom quantity', () => {
		render(<NumberInput quantity={5} />);
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('5');
	});

	// Graph: Interaction (Increment)
	test('increments value when below max', () => {
		const mockOnChange = jest.fn();
		render(<NumberInput quantity={1} max={5} onChangeQuantity={mockOnChange} />);

		const incrementBtn = screen.getAllByRole('button')[1]; // Second button is increment
		fireEvent.click(incrementBtn);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('2'); // Component updates internal state
		expect(mockOnChange).toHaveBeenCalledWith(2);
	});

	test('shows warning when incrementing past max', () => {
		jest.useFakeTimers();
		const mockOnChange = jest.fn();
		render(<NumberInput quantity={5} max={5} onChangeQuantity={mockOnChange} />);

		const incrementBtn = screen.getAllByRole('button')[1];
		fireEvent.click(incrementBtn);

		expect(screen.getByText('Sorry, we have limited quantity available for this product')).toBeInTheDocument();
		expect(mockOnChange).not.toHaveBeenCalled();

		// Fast-forward timer to clear message
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.queryByText('Sorry, we have limited quantity available for this product')).not.toBeInTheDocument();
		jest.useRealTimers();
	});

	// Graph: Interaction (Decrement)
	test('decrements value when above min', () => {
		const mockOnChange = jest.fn();
		render(<NumberInput quantity={2} min={1} onChangeQuantity={mockOnChange} />);

		const decrementBtn = screen.getAllByRole('button')[0]; // First button is decrement
		fireEvent.click(decrementBtn);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('1');
		expect(mockOnChange).toHaveBeenCalledWith(1);
	});

	test('shows warning when decrementing below min', () => {
		jest.useFakeTimers();
		const mockOnChange = jest.fn();
		render(<NumberInput quantity={1} min={1} onChangeQuantity={mockOnChange} />);

		const decrementBtn = screen.getAllByRole('button')[0];
		fireEvent.click(decrementBtn);

		expect(screen.getByText('Atleat 1 item should be required')).toBeInTheDocument();
		expect(mockOnChange).not.toHaveBeenCalled();

		act(() => {
			jest.runAllTimers();
		});
		expect(screen.queryByText('Atleat 1 item should be required')).not.toBeInTheDocument();
		jest.useRealTimers();
	});
});
