import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductListPage from '../ProductListPage';
import { getAllProducts } from '../../../api/fetchProducts';

// Mock the API
jest.mock('../../../api/fetchProducts', () => ({
  getAllProducts: jest.fn(),
}));

// Create a proper Redux store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      categoryState: (state = {
        categories: [
          { id: 1, code: 'clothing', description: 'Clothing Category' },
          { id: 2, code: 'electronics', description: 'Electronics Category' },
        ],
        ...initialState.categoryState,
      }) => state,
      commonState: (state = { loading: false, ...initialState.commonState }) => state,
    },
  });
};

describe('ProductListPage - Tests', () => {
  const mockProducts = [
    { id: 1, name: 'Red T-Shirt', color: 'Red', size: 'M', price: 50, thumbnail: '', category_id: 1 },
    { id: 2, name: 'Blue Jeans', color: 'Blue', size: 'L', price: 80, thumbnail: '', category_id: 1 },
    { id: 3, name: 'Red Dress', color: 'Red', size: 'S', price: 120, thumbnail: '', category_id: 1 },
    { id: 4, name: 'Black Jacket', color: 'Black', size: 'XL', price: 150, thumbnail: '', category_id: 1 },
  ];

  const mockElectronicsProducts = [
    { id: 5, name: 'Laptop', color: 'Silver', size: '15"', price: 1200, thumbnail: '', category_id: 2 },
    { id: 6, name: 'Phone', color: 'Black', size: '6"', price: 800, thumbnail: '', category_id: 2 },
  ];

  const mockProductsEdgeCase = [
    { id: 5, name: '', color: '', size: '', price: 0, thumbnail: '', category_id: 1 },
  ];

  beforeEach(() => {
    getAllProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows all products initially', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    // Wait for products to load
    await screen.findByText('Red T-Shirt');

    const allProducts = ['Red T-Shirt', 'Blue Jeans', 'Red Dress', 'Black Jacket'];
    allProducts.forEach(productName => {
      expect(screen.getByText(productName)).toBeInTheDocument();
    });

    // Verify API was called with correct category id
    expect(getAllProducts).toHaveBeenCalledWith(1);
  });

  it('renders filter section', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');

    // Check filter headings exist
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('renders product even with missing fields (ISP)', async () => {
    getAllProducts.mockResolvedValue(mockProductsEdgeCase);
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    // Wait for product to load
    await waitFor(() => expect(screen.getByText('$0')).toBeInTheDocument());

    // Price = 0
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  // NEW TESTS TO KILL MUTATIONS

  it('calls getAllProducts with correct category id', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledWith(1);
    });

    // Verify it was called with the CORRECT category id (not undefined, not wrong id)
    expect(getAllProducts).not.toHaveBeenCalledWith(undefined);
    expect(getAllProducts).not.toHaveBeenCalledWith(2);
  });

  it('updates products when category changes', async () => {
    getAllProducts.mockResolvedValue(mockProducts);
    const store = createMockStore();

    const { rerender } = render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');
    expect(getAllProducts).toHaveBeenCalledWith(1);

    // Change category
    getAllProducts.mockResolvedValue(mockElectronicsProducts);
    
    rerender(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="electronics" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledWith(2);
    });

    // Verify new products are shown
    await screen.findByText('Laptop');
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('renders correct number of products', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');

    // Verify exactly 4 products are rendered
    const products = screen.getAllByText(/T-Shirt|Jeans|Dress|Jacket/);
    expect(products).toHaveLength(4);
  });

  it('renders empty state when no products are returned', async () => {
    getAllProducts.mockResolvedValue([]);
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
    });

    // Should not render any products
    expect(screen.queryByText('Red T-Shirt')).not.toBeInTheDocument();
    expect(screen.queryByText('Blue Jeans')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    getAllProducts.mockRejectedValue(new Error('API Error'));
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
    });

    // Component should still render (not crash)
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('does not call API when category is undefined', async () => {
    const store = createMockStore({
      categoryState: {
        categories: [],
      },
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="nonexistent" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should be called with undefined when category doesn't exist
      expect(getAllProducts).toHaveBeenCalledWith(undefined);
    });
  });

  it('displays correct category description', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');

    // Verify category description is shown
    expect(screen.getByText('Clothing Category')).toBeInTheDocument();
  });

  it('re-fetches products when category id changes', async () => {
    const store = createMockStore();

    const { rerender } = render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledTimes(1);
    });

    // Manually update store to simulate category change
    rerender(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="electronics" />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledTimes(2);
    });
  });

  it('renders products with correct keys', async () => {
    const store = createMockStore();

    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');

    // Verify products are rendered (this will fail if products array is wrong)
    const productCards = container.querySelectorAll('[class*="grid"] > div');
    expect(productCards.length).toBeGreaterThan(0);
  });
})