import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductDetails from './ProductDetails';
import { getAllProducts } from '../../api/fetchProducts';
import { addItemToCartAction } from '../../store/actions/cartAction';

// Mock Dependencies
jest.mock('react-redux', () => ({
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLoaderData: jest.fn(),
	useParams: jest.fn(),
}));

jest.mock('../../api/fetchProducts');
jest.mock('../../store/actions/cartAction');

// Mock Components to avoid deep rendering and focus on ProductDetails logic
jest.mock('../../components/Breadcrumb/Breadcrumb', () => () => <div data-testid="breadcrumb">Breadcrumb</div>);
jest.mock('../../components/Rating/Rating', () => () => <div data-testid="rating">Rating</div>);
jest.mock('../../components/Filters/SizeFilter', () => ({ onChange, sizes }) => (
	<div data-testid="size-filter">
		{sizes?.map(size => (
			<button key={size} onClick={() => onChange([size])}>{size}</button>
		))}
	</div>
));
jest.mock('./ProductColors', () => () => <div data-testid="product-colors">ProductColors</div>);
jest.mock('../../components/Sections/SectionsHeading/SectionHeading', () => ({ title }) => <div>{title}</div>);
jest.mock('../ProductListPage/ProductCard', () => () => <div data-testid="product-card">ProductCard</div>);

// Mock Icons
jest.mock('../../components/common/SvgCreditCard', () => () => <svg>CreditCard</svg>);
jest.mock('../../components/common/SvgCloth', () => () => <svg>Cloth</svg>);
jest.mock('../../components/common/SvgShipping', () => () => <svg>Shipping</svg>);
jest.mock('../../components/common/SvgReturn', () => () => <svg>Return</svg>);


describe('ProductDetails Component', () => {
	const mockDispatch = jest.fn();
	const mockProduct = {
		id: 1,
		name: 'Test Product',
		price: 100,
		rating: 4.5,
		description: 'Test Description',
		thumbnail: 'thumb.jpg',
		categoryId: 10,
		categoryTypeId: 20,
		variants: [
			{ id: 101, size: 'M', color: 'Red', stockQuantity: 5 },
			{ id: 102, size: 'L', color: 'Blue', stockQuantity: 0 } // Out of stock
		],
		productResources: [
			{ url: 'img1.jpg' },
			{ url: 'img2.jpg' }
		]
	};

	const mockCategories = [
		{
			id: 10,
			name: 'Category 1',
			categoryTypes: [{ id: 20, name: 'Type 1' }]
		}
	];

	beforeEach(() => {
		useDispatch.mockReturnValue(mockDispatch);
		useSelector.mockImplementation(cb => cb({
			cartState: { cart: [] },
			categoryState: { categories: mockCategories }
		}));
		require('react-router-dom').useLoaderData.mockReturnValue({ product: mockProduct });
		getAllProducts.mockResolvedValue([]); // No similar products by default
		addItemToCartAction.mockReturnValue({ type: 'ADD_ITEM' });
		mockDispatch.mockClear();
	});

	// ISP: Rendering
	test('renders product details correctly', async () => {
		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		expect(screen.getByText('Test Product')).toBeInTheDocument();
		expect(screen.getByText('$100')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByTestId('rating')).toBeInTheDocument();
		expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
		expect(screen.getByTestId('size-filter')).toBeInTheDocument();
		expect(screen.getByTestId('product-colors')).toBeInTheDocument();

		// Check initial image
		const mainImg = screen.getByAltText('Test Product');
		expect(mainImg).toHaveAttribute('src', 'thumb.jpg');
	});

	// Graph: Interaction (Image Gallery)
	test('updates main image when clicking gallery thumbnail', () => {
		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		const thumbBtn = screen.getByAltText('sample-0').closest('button');
		fireEvent.click(thumbBtn);

		const mainImg = screen.getByAltText('Test Product');
		expect(mainImg).toHaveAttribute('src', 'img1.jpg');
	});

	// Graph: Logic & Control Flow (Add to Cart)
	test('shows error when adding to cart without selecting size', () => {
		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		const addToCartBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addToCartBtn);

		expect(screen.getByText('Please select size')).toBeInTheDocument();
		expect(mockDispatch).not.toHaveBeenCalled();
	});

	test('adds to cart successfully when size is selected and in stock', () => {
		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		// Select size M
		const sizeBtn = screen.getByText('M');
		fireEvent.click(sizeBtn);

		const addToCartBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addToCartBtn);

		expect(screen.queryByText('Please select size')).not.toBeInTheDocument();
		expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
			type: 'ADD_ITEM' // The mock returns this
		}));
		// Verify action creator call arguments
		expect(addItemToCartAction).toHaveBeenCalledWith(expect.objectContaining({
			productId: 1,
			variant: expect.objectContaining({ size: 'M' })
		}));
	});

	test('shows error when selected variant is out of stock', () => {
		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		// Select size L (Out of stock)
		const sizeBtn = screen.getByText('L');
		fireEvent.click(sizeBtn);

		const addToCartBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addToCartBtn);

		expect(screen.getByText('Out of Stock')).toBeInTheDocument();
		expect(mockDispatch).not.toHaveBeenCalled();
	});

	// Graph: Similar Products
	test('fetches and renders similar products', async () => {
		const similarProducts = [{ id: 2, name: 'Similar Product' }];
		getAllProducts.mockResolvedValue(similarProducts);

		render(
			<BrowserRouter>
				<ProductDetails />
			</BrowserRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('product-card')).toBeInTheDocument();
		});
	});
});
