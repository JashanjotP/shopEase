import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderConfirmed from './OrderConfirmed';

describe('OrderConfirmed Component', () => {
	// ISP: Rendering
	test('renders order confirmation message and ID', () => {
		const orderId = '12345';
		render(
			<MemoryRouter initialEntries={[`/orderConfirmed?orderId=${orderId}`]}>
				<OrderConfirmed />
			</MemoryRouter>
		);

		expect(screen.getByText('Thank you for shopping with us!')).toBeInTheDocument();
		expect(screen.getByText(orderId)).toBeInTheDocument();
	});
});
