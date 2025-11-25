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

import { httpClient } from './AdminPanel';
import { fetchUtils } from 'react-admin';

describe('httpClient', () => {
	beforeEach(() => {
		localStorage.clear();
		fetchUtils.fetchJson.mockClear();
	});

	test('adds Authorization header', () => {
		localStorage.setItem('authToken', 'test-token');
		httpClient('http://test.com');

		const expectedOptions = {
			headers: new Headers({
				'Authorization': 'Bearer test-token'
			})
		};

		expect(fetchUtils.fetchJson).toHaveBeenCalledWith('http://test.com', expect.objectContaining({
			headers: expect.any(Headers)
		}));

		// Check header value manually since Headers object equality is tricky
		const callArgs = fetchUtils.fetchJson.mock.calls[0];
		const options = callArgs[1];
		expect(options.headers.get('Authorization')).toBe('Bearer test-token');
	});
});
