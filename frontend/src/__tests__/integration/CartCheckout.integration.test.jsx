import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CheckoutForm from '../../pages/PaymentPage/CheckoutPayment'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartReducer from '../../store/features/cart'

// Use real axios for network interception by MSW
jest.unmock('axios')
// Mock order API
jest.mock('../../api/order', () => ({
  placeOrderAPI: jest.fn()
}))
import { placeOrderAPI } from '../../api/order'

// Mock stripe hooks used in CheckoutPayment
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({ confirmPayment: jest.fn().mockResolvedValue({}) }),
  useElements: () => ({ submit: jest.fn().mockResolvedValue({}) }),
  PaymentElement: () => <div data-testid="payment-element" />
}))

describe('Cart & Checkout integration', () => {
  test('assembling order request and calling placeOrderAPI', async () => {
    const cartItem = {
      productId: 'p1',
      thumbnail: 'http://example.com/t.jpg',
      name: 'Test Product',
      variant: { id: 'v1' },
      quantity: 1,
      subTotal: 100,
      price: 100
    }

    const rootReducer = combineReducers({ cartState: cartReducer })
    const preloadedState = { cartState: { cart: [cartItem] } }
    const store = configureStore({ reducer: rootReducer, preloadedState })

    // Mock the API to resolve with credentials
    placeOrderAPI.mockResolvedValueOnce({ credentials: { client_secret: 'cs_test' } })

    render(
      <Provider store={store}>
        <CheckoutForm userId={'user-123'} addressId={'addr-123'} />
      </Provider>
    )

    const payButton = await screen.findByText('Pay Now')
    fireEvent.click(payButton)

    await waitFor(() => expect(placeOrderAPI).toHaveBeenCalled())

    const calledWith = placeOrderAPI.mock.calls[0][0]
    // Basic assertions on payload
    expect(calledWith.userId).toBe('user-123')
    expect(calledWith.addressId).toBe('addr-123')
    expect(calledWith.orderItemRequests).toHaveLength(1)
    expect(calledWith.orderItemRequests[0]).toEqual({
      productId: 'p1',
      productVariantId: 'v1',
      discount: 0,
      quantity: 1
    })
    expect(calledWith.paymentMethod).toBe('CARD')
  })
})
