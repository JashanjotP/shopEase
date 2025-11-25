import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentPage from './PaymentPage';
import { Elements } from '@stripe/react-stripe-js';

// Mock Dependencies
jest.mock('@stripe/react-stripe-js', () => ({
	Elements: ({ children }) => <div data-testid="stripe-elements">{children}</div>
}));
jest.mock('./CheckoutPayment', () => () => <div data-testid="checkout-form">Checkout Form</div>);
jest.mock('@stripe/stripe-js', () => ({
	loadStripe: jest.fn(() => Promise.resolve({}))
}));

describe('PaymentPage Component', () => {
	// ISP: Rendering
	test('renders checkout form wrapped in stripe elements', () => {
		render(<PaymentPage />);

		expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
		expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
	});
});
