import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddAddress from './AddAddress';
import { addAddressAPI } from '../../api/userInfo';
import { setLoading } from '../../store/features/common';
import { saveAddress } from '../../store/features/user';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.unmock('../../store/features/common');
jest.unmock('../../store/features/user'); // Use real user actions

const mockStore = configureStore([]);

describe('AddAddress Component', () => {
	let store;
	const mockOnCancel = jest.fn();
	let consoleLogSpy;
	let consoleErrorSpy;

	beforeEach(() => {
		store = mockStore({});
		mockOnCancel.mockClear();
		addAddressAPI.mockClear();

		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});

	test('initial state is empty', () => {
		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		expect(screen.getByPlaceholderText('Contact person name').value).toBe('');
		expect(screen.getByPlaceholderText('Contact number').value).toBe('');
		expect(screen.getByPlaceholderText('Address').value).toBe('');
		expect(screen.getByPlaceholderText('City').value).toBe('');
		expect(screen.getByPlaceholderText('State').value).toBe('');
		expect(screen.getByPlaceholderText('Zip code').value).toBe('');

		// Kill LogicalOperator mutant (&& -> ||)
		// Ensure error paragraph is NOT present
		const errorElement = screen.queryByText((content, element) => {
			return element.tagName.toLowerCase() === 'p' && element.className.includes('text-red-700');
		});
		expect(errorElement).not.toBeInTheDocument();
	});

	test('submits form successfully and handles loading/error states', async () => {
		const mockResponse = { id: 1, name: 'Test Address' };
		addAddressAPI.mockResolvedValue(mockResponse);

		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		// Fill form
		fireEvent.change(screen.getByPlaceholderText('Contact person name'), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByPlaceholderText('Contact number'), { target: { value: '1234567890' } });
		fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 St' } });
		fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
		fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } });
		fireEvent.change(screen.getByPlaceholderText('Zip code'), { target: { value: '12345' } });

		fireEvent.click(screen.getByText('Save'));

		// Verify loading state started
		const actions = store.getActions();
		expect(actions).toContainEqual(setLoading(true));

		await waitFor(() => {
			expect(addAddressAPI).toHaveBeenCalledWith({
				name: 'John Doe',
				phoneNumber: '1234567890',
				street: '123 St',
				city: 'City',
				state: 'State',
				zipCode: '12345'
			});
		});

		// Wait for the promise chain to complete by waiting for the final action (setLoading(false))
		await waitFor(() => {
			const currentActions = store.getActions();
			expect(currentActions).toContainEqual(setLoading(false));
		});

		// Verify console logs for success path
		expect(consoleLogSpy).toHaveBeenCalledWith('DEBUG: addAddressAPI resolved', mockResponse);
		expect(consoleLogSpy).toHaveBeenCalledWith('DEBUG: dispatch saveAddress success');
		expect(consoleLogSpy).toHaveBeenCalledWith('DEBUG: calling onCancel');

		// Verify dispatch saveAddress
		const expectedAction = saveAddress(mockResponse);
		expect(store.getActions()).toContainEqual(expectedAction);

		// Verify onCancel called
		expect(mockOnCancel).toHaveBeenCalled();
	});

	test('handles submission error and logs correctly', async () => {
		const mockError = new Error('Failed');
		addAddressAPI.mockRejectedValue(mockError);

		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(screen.getByText('Address was not added.')).toBeInTheDocument();
		});

		// Verify console logs for error path
		expect(consoleLogSpy).toHaveBeenCalledWith('DEBUG: addAddressAPI rejected', mockError);

		// Verify loading state ended
		expect(store.getActions()).toContainEqual(setLoading(false));
	});

	test('handles missing onCancel prop', async () => {
		addAddressAPI.mockResolvedValue({});

		render(
			<Provider store={store}>
				<AddAddress />
			</Provider>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(addAddressAPI).toHaveBeenCalled();
		});

		expect(consoleLogSpy).toHaveBeenCalledWith('DEBUG: onCancel is undefined');
	});
});
