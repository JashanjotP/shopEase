import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Shop from './Shop';
import { fetchCategories } from './api/fetchCategories';

// Mock Dependencies
jest.mock('./components/HeroSection/HeroSection', () => () => <div data-testid="hero-section">Hero Section</div>);
jest.mock('./components/Sections/NewArrivals', () => () => <div data-testid="new-arrivals">New Arrivals</div>);
jest.mock('./components/Sections/Categories/Category', () => () => <div data-testid="category-section">Category Section</div>);
jest.mock('./components/Footer/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('./api/fetchCategories');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Shop Component', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			categoryState: { categories: [] },
			commonState: { loading: false }
		});
		fetchCategories.mockResolvedValue([{ id: 1, title: 'Men' }]);
	});

	test('renders Shop component and fetches categories', async () => {
		render(
			<Provider store={store}>
				<Shop />
			</Provider>
		);

		expect(screen.getByTestId('hero-section')).toBeInTheDocument();
		expect(screen.getByTestId('new-arrivals')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();

		await waitFor(() => {
			expect(fetchCategories).toHaveBeenCalled();
		});
	});
});
