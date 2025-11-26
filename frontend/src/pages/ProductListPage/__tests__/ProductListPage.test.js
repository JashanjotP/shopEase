
// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { MemoryRouter } from 'react-router-dom';
// import { configureStore } from '@reduxjs/toolkit';
// import ProductListPage from '../ProductListPage';
// import { getAllProducts } from '../../../api/fetchProducts';

// // Mock the API
// jest.mock('../../../api/fetchProducts', () => ({
//   getAllProducts: jest.fn(),
// }));

// // Create a proper Redux store for testing
// const createMockStore = () => {
//   return configureStore({
//     reducer: {
//       categoryState: (state = {
//         categories: [
//           { id: 1, code: 'clothing', description: 'Clothing Category' },
//         ],
//       }) => state,
//       commonState: (state = { loading: false }) => state,
//     },
//   });
// };

// describe('ProductListPage - Tests', () => {
//   const mockProducts = [
//     { id: 1, name: 'Red T-Shirt', color: 'Red', size: 'M', price: 50, thumbnail: '' },
//     { id: 2, name: 'Blue Jeans', color: 'Blue', size: 'L', price: 80, thumbnail: '' },
//     { id: 3, name: 'Red Dress', color: 'Red', size: 'S', price: 120, thumbnail: '' },
//     { id: 4, name: 'Black Jacket', color: 'Black', size: 'XL', price: 150, thumbnail: '' },
//   ];

//   beforeEach(() => {
//     getAllProducts.mockResolvedValue(mockProducts);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('shows all products initially', async () => {
//     const store = createMockStore();

//     render(
//       <MemoryRouter>
//         <Provider store={store}>
//           <ProductListPage categoryType="clothing" />
//         </Provider>
//       </MemoryRouter>
//     );

//     // Wait for products to load
//     await screen.findByText('Red T-Shirt');

//     const allProducts = ['Red T-Shirt', 'Blue Jeans', 'Red Dress', 'Black Jacket'];
//     allProducts.forEach(productName => {
//       expect(screen.getByText(productName)).toBeInTheDocument();
//     });

//     // Verify API was called with correct category id
//     expect(getAllProducts).toHaveBeenCalledWith(1);
//   });

//   it('renders filter section', async () => {
//     const store = createMockStore();

//     render(
//       <MemoryRouter>
//         <Provider store={store}>
//           <ProductListPage categoryType="clothing" />
//         </Provider>
//       </MemoryRouter>
//     );

//     await screen.findByText('Red T-Shirt');

//     // Check filter headings exist
//     expect(screen.getByText('Filter')).toBeInTheDocument();
//     expect(screen.getByText('Categories')).toBeInTheDocument();
//     expect(screen.getByText('Price')).toBeInTheDocument();
//     expect(screen.getByText('Colors')).toBeInTheDocument();
//     expect(screen.getByText('Size')).toBeInTheDocument();
//   });

//   it('does not filter products correctly (all products remain visible)', async () => {
//     const store = createMockStore();

//     render(
//       <MemoryRouter>
//         <Provider store={store}>
//           <ProductListPage categoryType="clothing" />
//         </Provider>
//       </MemoryRouter>
//     );

//     // Wait for products to load
//     await screen.findByText('Red T-Shirt');

//     // Since filters are not implemented, all products are still visible
//     const allProducts = ['Red T-Shirt', 'Blue Jeans', 'Red Dress', 'Black Jacket'];
//     allProducts.forEach(productName => {
//       expect(screen.getByText(productName)).toBeInTheDocument();
//     });
//   });
// });


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
const createMockStore = () => {
  return configureStore({
    reducer: {
      categoryState: (state = {
        categories: [
          { id: 1, code: 'clothing', description: 'Clothing Category' },
        ],
      }) => state,
      commonState: (state = { loading: false }) => state,
    },
  });
};

describe('ProductListPage - Tests', () => {
  const mockProducts = [
    { id: 1, name: 'Red T-Shirt', color: 'Red', size: 'M', price: 50, thumbnail: '' },
    { id: 2, name: 'Blue Jeans', color: 'Blue', size: 'L', price: 80, thumbnail: '' },
    { id: 3, name: 'Red Dress', color: 'Red', size: 'S', price: 120, thumbnail: '' },
    { id: 4, name: 'Black Jacket', color: 'Black', size: 'XL', price: 150, thumbnail: '' },
  ];

  const mockProductsEdgeCase = [
    { id: 5, name: '', color: '', size: '', price: 0, thumbnail: '' }, // missing info for ISP
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

  // ISP test for edge-case product data
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

    // Name is empty
    const productNameElement = screen.getByText('', { selector: 'p' });
    expect(productNameElement).toBeInTheDocument();

    // Price = 0
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  // fail test for unimplemented filters
  it('fails - does not filter products (expected FAIL)', async () => {
    const store = createMockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductListPage categoryType="clothing" />
        </Provider>
      </MemoryRouter>
    );

    await screen.findByText('Red T-Shirt');

    // Blue Jeans is still visible because filtering is not implemented
    expect(screen.queryByText('Blue Jeans')).toBeNull();
  });
});
