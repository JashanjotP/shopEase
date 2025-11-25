import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddAddress from './AddAddress';
import { addAddressAPI } from '../../api/userInfo';

// Mock Dependencies
jest.mock('../../api/userInfo');
jest.unmock('../../store/features/common');
jest.mock('../../store/features/user', () => ({
	saveAddress: jest.fn(() => ({ type: 'user/saveAddress' }))
}));

const mockStore = configureStore([]); // No thunk needed

describe('AddAddress Component', () => {
	let store;
	const mockOnCancel = jest.fn();

	beforeEach(() => {
		store = mockStore({});
		mockOnCancel.mockClear();
		addAddressAPI.mockClear();
	});

	// ISP: Rendering
	test('renders form inputs', () => {
		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		expect(screen.getByText('Add Address')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Contact person name')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Contact number')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
	});

	// Graph: Form Submission
	test('submits form successfully', async () => {
		addAddressAPI.mockResolvedValue({ id: 1, name: 'Test Address' });

		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		fireEvent.change(screen.getByPlaceholderText('Contact person name'), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByPlaceholderText('Contact number'), { target: { value: '1234567890' } });
		fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 St' } });
		fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
		fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } });
		fireEvent.change(screen.getByPlaceholderText('Zip code'), { target: { value: '12345' } });

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(addAddressAPI).toHaveBeenCalled();
			expect(mockOnCancel).toHaveBeenCalled();
		});
	});

	test('handles submission error', async () => {
		addAddressAPI.mockRejectedValue(new Error('Failed'));

		render(
			<Provider store={store}>
				<AddAddress onCancel={mockOnCancel} />
			</Provider>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(screen.getByText(/Address was not added/i)).toBeInTheDocument();
		});
	});
});
