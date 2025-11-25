import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminPanel } from './AdminPanel';

// Mock react-admin
jest.mock('react-admin', () => ({
	Admin: ({ children }) => <div data-testid="admin">{children}</div>,
	Resource: ({ name }) => <div data-testid={`resource-${name}`}>{name}</div>,
	fetchUtils: { fetchJson: jest.fn() },
	withLifecycleCallbacks: jest.fn((provider) => provider),
}));
jest.mock('ra-data-simple-rest', () => jest.fn(() => ({})));

describe('AdminPanel Component', () => {
	// ISP: Rendering
	test('renders Admin component with resources', () => {
		render(<AdminPanel />);

		expect(screen.getByTestId('admin')).toBeInTheDocument();
		expect(screen.getByTestId('resource-products')).toBeInTheDocument();
		expect(screen.getByTestId('resource-category')).toBeInTheDocument();
	});
});
