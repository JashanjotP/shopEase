import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection Component', () => {
	// ISP: Rendering
	test('renders hero section with text and button', () => {
		render(<HeroSection />);

		expect(screen.getByText('T-shirt / Tops')).toBeInTheDocument();
		expect(screen.getByText('Summer Value Pack')).toBeInTheDocument();
		expect(screen.getByText('cool / colorful / comfy')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Shop Now/i })).toBeInTheDocument();
	});

	// Graph: Interaction & Control Flow
	test('scrolls to new-arrivals-section on button click', () => {
		render(<HeroSection />);

		const scrollIntoViewMock = jest.fn();
		const getElementByIdMock = jest.spyOn(document, 'getElementById').mockReturnValue({
			scrollIntoView: scrollIntoViewMock
		});

		const button = screen.getByRole('button', { name: /Shop Now/i });
		fireEvent.click(button);

		expect(getElementByIdMock).toHaveBeenCalledWith('new-arrivals-section');
		expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

		getElementByIdMock.mockRestore();
	});

	test('does not crash if section is missing (Robustness)', () => {
		render(<HeroSection />);

		// Mock getElementById to return null
		const getElementByIdMock = jest.spyOn(document, 'getElementById').mockReturnValue(null);

		const button = screen.getByRole('button', { name: /Shop Now/i });
		// Should not throw error
		fireEvent.click(button);

		expect(getElementByIdMock).toHaveBeenCalledWith('new-arrivals-section');

		getElementByIdMock.mockRestore();
	});
});
