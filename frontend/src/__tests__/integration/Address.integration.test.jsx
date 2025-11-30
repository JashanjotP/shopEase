import React from 'react'
// Mock the userInfo API module so tests are deterministic and do not rely
// on the repo-level axios manual mock or ESM axios package during Jest runs.
jest.mock('../../api/userInfo', () => ({
  addAddressAPI: jest.fn()
}))
const { addAddressAPI } = require('../../api/userInfo')

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from '../../store/features/product'
import cartReducer from '../../store/features/cart'
import categoryReducer from '../../store/features/category'
import commonReducer from '../../store/features/common'
import userReducer from '../../store/features/user'
import AddAddress from '../../pages/Account/AddAddress'

describe('AddAddress Integration (MSW)', () => {
  test('submits form and updates user address list from server response', async () => {
    // Mock the API to return the expected created address (avoid hitting ESM axios)
    addAddressAPI.mockResolvedValueOnce({ id: 'addr-new', name: 'John Doe', city: 'City' })
    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    // Ensure userState has an addressList to avoid reducer spread issues
    const preloadedState = {
      userState: {
        userInfo: {
          addressList: []
        }
      }
    }

    const store = configureStore({ reducer: rootReducer, preloadedState })

    const mockOnCancel = jest.fn()

    render(
      <Provider store={store}>
        <AddAddress onCancel={mockOnCancel} />
      </Provider>
    )

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText('Contact person name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Contact number'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 St' } })
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } })
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } })
    fireEvent.change(screen.getByPlaceholderText('Zip code'), { target: { value: '12345' } })

    // Submit the form
    fireEvent.click(screen.getByText('Save'))

    // Wait for MSW handler to respond and onCancel to be called
    await waitFor(() => expect(mockOnCancel).toHaveBeenCalled())

    // Verify the store's userState was updated with the new address returned by MSW
    const addresses = store.getState().userState.userInfo.addressList
    expect(addresses).toBeDefined()
    expect(addresses).toHaveLength(1)
    expect(addresses[0]).toMatchObject({ id: 'addr-new', name: 'John Doe', city: 'City' })
  })
})
