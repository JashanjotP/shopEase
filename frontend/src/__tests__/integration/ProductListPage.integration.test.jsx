import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductListPage from '../../pages/ProductListPage/ProductListPage'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import productReducer from '../../store/features/product'
import cartReducer from '../../store/features/cart'
import categoryReducer from '../../store/features/category'
import commonReducer from '../../store/features/common'
import userReducer from '../../store/features/user'

// Mock the API module used by the component
jest.mock('../../api/fetchProducts', () => ({
  getAllProducts: jest.fn(),
}))

import { getAllProducts } from '../../api/fetchProducts'
import { MemoryRouter } from 'react-router-dom'

// Stub Rating component to avoid numeric edge-cases in tests
jest.mock('../../components/Rating/Rating', () => () => <div data-testid="rating">0</div>)

describe('ProductListPage integration', () => {
  test('fetches and displays products for a category', async () => {
    // arrange: mock API to return sample products
    getAllProducts.mockResolvedValueOnce([
      { id: 'p1', name: 'Test Phone', thumbnail: 'http://example.com/t.jpg' }
    ])

    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const preloadedState = {
      categoryState: { categories: [{ id: 'cat-1', code: 'ELEC', description: 'Electronics' }] },
      commonState: { loading: false },
      cartState: { cart: [] },
      productState: {},
      userState: {},
    }

    const store = configureStore({ reducer: rootReducer, preloadedState })

    // act: render the page with the categoryType prop matching our category
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListPage categoryType={'ELEC'} />
        </MemoryRouter>
      </Provider>
    )

    // assert: wait for mocked product to appear
    await waitFor(() => expect(getAllProducts).toHaveBeenCalled())
    expect(await screen.findByText('Test Phone')).toBeInTheDocument()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'http://example.com/t.jpg')
  })
})
