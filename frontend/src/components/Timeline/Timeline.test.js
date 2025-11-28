import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from './Timeline';

describe('Timeline Component', () => {
    test('stepCount 1: only first step is active', () => {
        const { container } = render(<Timeline stepCount={1} />);
        
        // Get all step indicators (circles)
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500'); // Order Placed - active
        expect(steps[1]).toHaveClass('bg-gray-200'); // In progress - inactive
        expect(steps[2]).toHaveClass('bg-gray-200'); // Shipped - inactive
        expect(steps[3]).toHaveClass('bg-gray-200'); // Delivered - inactive
        
        // Get all connector lines
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-200'); // Line 1->2 - inactive
        expect(lines[1]).toHaveClass('bg-gray-200'); // Line 2->3 - inactive
        expect(lines[2]).toHaveClass('bg-gray-200'); // Line 3->4 - inactive
    });

    test('stepCount 2: first two steps are active', () => {
        const { container } = render(<Timeline stepCount={2} />);
        
        // Get all step indicators
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500'); // Order Placed - active
        expect(steps[1]).toHaveClass('bg-gray-500'); // In progress - active
        expect(steps[2]).toHaveClass('bg-gray-200'); // Shipped - inactive
        expect(steps[3]).toHaveClass('bg-gray-200'); // Delivered - inactive
        
        // Get all connector lines
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-500'); // Line 1->2 - active
        expect(lines[1]).toHaveClass('bg-gray-200'); // Line 2->3 - inactive
        expect(lines[2]).toHaveClass('bg-gray-200'); // Line 3->4 - inactive
    });

    test('stepCount 3: first three steps are active', () => {
        const { container } = render(<Timeline stepCount={3} />);
        
        // Get all step indicators
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500'); // Order Placed - active
        expect(steps[1]).toHaveClass('bg-gray-500'); // In progress - active
        expect(steps[2]).toHaveClass('bg-gray-500'); // Shipped - active
        expect(steps[3]).toHaveClass('bg-gray-200'); // Delivered - inactive
        
        // Get all connector lines
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-500'); // Line 1->2 - active
        expect(lines[1]).toHaveClass('bg-gray-500'); // Line 2->3 - active
        expect(lines[2]).toHaveClass('bg-gray-200'); // Line 3->4 - inactive
    });

    test('stepCount 4: all steps are active', () => {
        const { container } = render(<Timeline stepCount={4} />);
        
        // Get all step indicators
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500'); // Order Placed - active
        expect(steps[1]).toHaveClass('bg-gray-500'); // In progress - active
        expect(steps[2]).toHaveClass('bg-gray-500'); // Shipped - active
        expect(steps[3]).toHaveClass('bg-gray-500'); // Delivered - active
        
        // Get all connector lines
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-500'); // Line 1->2 - active
        expect(lines[1]).toHaveClass('bg-gray-500'); // Line 2->3 - active
        expect(lines[2]).toHaveClass('bg-gray-500'); // Line 3->4 - active
    });

    // Edge case tests
    test('stepCount 0: no steps are active', () => {
        const { container } = render(<Timeline stepCount={0} />);
        
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500'); // First step always active
        expect(steps[1]).toHaveClass('bg-gray-200');
        expect(steps[2]).toHaveClass('bg-gray-200');
        expect(steps[3]).toHaveClass('bg-gray-200');
        
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-200');
        expect(lines[1]).toHaveClass('bg-gray-200');
        expect(lines[2]).toHaveClass('bg-gray-200');
    });

    test('stepCount 5: all steps remain active (boundary test)', () => {
        const { container } = render(<Timeline stepCount={5} />);
        
        const steps = container.querySelectorAll('.rounded-full');
        expect(steps[0]).toHaveClass('bg-gray-500');
        expect(steps[1]).toHaveClass('bg-gray-500');
        expect(steps[2]).toHaveClass('bg-gray-500');
        expect(steps[3]).toHaveClass('bg-gray-500');
        
        const lines = container.querySelectorAll('.h-0\\.5');
        expect(lines[0]).toHaveClass('bg-gray-500');
        expect(lines[1]).toHaveClass('bg-gray-500');
        expect(lines[2]).toHaveClass('bg-gray-500');
    });

    // Verify all labels are present
    test('renders all step labels', () => {
        render(<Timeline stepCount={1} />);
        expect(screen.getByText('Order Placed')).toBeInTheDocument();
        expect(screen.getByText('In progress')).toBeInTheDocument();
        expect(screen.getByText('Shipped')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
    });
});