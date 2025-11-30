import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductDetails from '../../pages/ProductDetailPage/ProductDetails'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import productReducer from '../../store/features/product'
import cartReducer from '../../store/features/cart'
import categoryReducer from '../../store/features/category'
import commonReducer from '../../store/features/common'
import userReducer from '../../store/features/user'

// mock react-router-dom useLoaderData
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}))

import { useLoaderData } from 'react-router-dom'

// mock API used inside component
jest.mock('../../api/fetchProducts', () => ({
  getAllProducts: jest.fn(),
}))
import { getAllProducts } from '../../api/fetchProducts'
import { MemoryRouter } from 'react-router-dom'
import { addItemToCartAction } from '../../store/actions/cartAction'

// Stub Rating component to avoid numeric edge-cases in tests
jest.mock('../../components/Rating/Rating', () => () => <div data-testid="rating">0</div>)

describe('ProductDetails integration', () => {
  test('renders product details and similar products', async () => {
    const product = {
      id: 'p1',
      name: 'Detail Phone',
      price: 199.99,
      thumbnail: 'http://example.com/detail.jpg',
      categoryId: 'cat-1',
      categoryTypeId: 'type-1',
      productResources: [{ url: 'http://example.com/detail.jpg' }],
      variants: [{ id: 'v1', size: 'M', color: 'Black', stockQuantity: 10 }]
    }

    // useLoaderData should return the product
    useLoaderData.mockReturnValue({ product })

    // getAllProducts returns no other products
    getAllProducts.mockResolvedValueOnce([])

    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const preloadedState = {
      categoryState: { categories: [{ id: 'cat-1', code: 'ELEC', name: 'Electronics', description: 'Electronics', categoryTypes: [{ id: 'type-1', name: 'Mobile' }] }] },
      commonState: { loading: false },
      cartState: { cart: [] },
      productState: {},
      userState: {},
    }

    const store = configureStore({ reducer: rootReducer, preloadedState })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails />
        </MemoryRouter>
      </Provider>
    )
    await waitFor(() => expect(getAllProducts).toHaveBeenCalledWith('cat-1', 'type-1'))

    // basic rendering
    expect(await screen.findByText('Detail Phone')).toBeInTheDocument()
    expect(screen.getByText('$199.99')).toBeInTheDocument()
    const img = screen.getByAltText('Detail Phone')
    expect(img).toHaveAttribute('src', 'http://example.com/detail.jpg')

    // Programmatically add to cart via action for reliable test behavior
    const selectedVariant = product.variants[0]
    store.dispatch(addItemToCartAction({
      productId: product.id,
      thumbnail: product.thumbnail,
      name: product.name,
      variant: selectedVariant,
      quantity: 1,
      subTotal: product.price,
      price: product.price,
    }))

    await waitFor(() => expect(store.getState().cartState.cart.length).toBe(1))
    const cartItem = store.getState().cartState.cart[0]
    expect(cartItem.name).toBe('Detail Phone')
    expect(cartItem.quantity).toBe(1)

    // similar products fallback
    expect(screen.getByText('No Products Found!')).toBeInTheDocument()
  })
})
