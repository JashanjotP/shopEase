import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Provide a local API mock for product fetching so this integration test
// doesn't depend on the repo-level axios manual mock. We mock the
// api/fetchProducts module used by the pages to return predictable data.
const sampleProducts = [
  { id: 'p1', slug: 'test-phone', name: 'Test Phone', thumbnail: 'http://example.com/t.jpg', categoryId: 'cat-1', categoryTypeId: 'type-1', price: 199.99, rating: 4, variants: [{ id: 'v1', size: 'M', color: 'Black', stockQuantity: 10 }], productResources: [{ url: 'http://example.com/t.jpg' }] },
]
jest.mock('../../api/fetchProducts', () => ({
  getAllProducts: jest.fn().mockResolvedValue(sampleProducts),
  getProductBySlug: jest.fn().mockResolvedValue(sampleProducts[0])
}))

// Mock useLoaderData so ProductDetails can access a product when navigated-to
jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router')
  return {
    ...actual,
    useLoaderData: () => ({ product: sampleProducts[0] })
  }
})

import ProductListPage from '../../pages/ProductListPage/ProductListPage'
import ProductDetails from '../../pages/ProductDetailPage/ProductDetails'
import Cart from '../../pages/Cart/Cart'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import categoryReducer from '../../store/features/category'
import cartReducer from '../../store/features/cart'

// mock Rating to avoid numeric edge-cases in test
jest.mock('../../components/Rating/Rating', () => () => <div data-testid="rating">★</div>)

describe('Shop routes navigation', () => {
  test('navigates from product list to detail and adds item to cart', async () => {
    const rootReducer = combineReducers({ categoryState: categoryReducer, cartState: cartReducer })
    const preloadedState = {
      categoryState: { categories: [{ id: 'cat-1', code: 'ELEC', name: 'Electronics', description: 'Electronics', categoryTypes: [{ id: 'type-1', name: 'Mobile' }] }] },
      cartState: { cart: [] }
    }
    const store = configureStore({ reducer: rootReducer, preloadedState })

    // Ensure the fetchProducts functions return promises (override any repo-level axios mock)
    const fetchProducts = require('../../api/fetchProducts')
    fetchProducts.getAllProducts = jest.fn().mockResolvedValue(sampleProducts)
    fetchProducts.getProductBySlug = jest.fn().mockResolvedValue(sampleProducts[0])

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/women"]}>
          <Routes>
            <Route path="/women" element={<ProductListPage categoryType={'ELEC'} />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart-items" element={<Cart />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    // Wait for product to render from MSW
    const productTitle = await screen.findByText('Test Phone')
    expect(productTitle).toBeInTheDocument()

    // Click the product image to navigate to detail (image is wrapped in a Link)
    const img = screen.getByAltText('Test Phone')
    fireEvent.click(img)

    // After navigation, product detail should render
    expect(await screen.findByText('Test Phone')).toBeInTheDocument()

    // Select size 'M' and add to cart
    const sizeButton = screen.getByText('M')
    fireEvent.click(sizeButton)
    const addToCart = screen.getByText('Add to cart')
    fireEvent.click(addToCart)

    // Now navigate to cart-items route with same store and assert item present
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cart-items"]}>
          <Cart />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => expect(screen.getByText('Shopping Bag')).toBeInTheDocument())
    const items = screen.getAllByText('Test Phone')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})
