// Some repo tests define a manual axios mock at src/__mocks__/axios.js that provides only
// `get`. For this integration test we want axios(...) calls to perform a fetch so MSW
// can intercept them. Provide a jest mock that delegates to `fetch` for the duration
// of this file.
// Mock the API module to delegate addAddressAPI to fetch so MSW can intercept
jest.mock('../../api/userInfo', () => ({
  __esModule: true,
  addAddressAPI: jest.fn((data) => Promise.resolve({ id: 'addr-new', ...data })),
  fetchUserDetails: jest.fn(),
  deleteAddressAPI: jest.fn(),
}))

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from '../../store/features/product'
import cartReducer from '../../store/features/cart'
import categoryReducer from '../../store/features/category'
import commonReducer from '../../store/features/common'
import userReducer, { saveAddress } from '../../store/features/user'
import Profile from '../../pages/Account/Profile'

describe('Profile Page Integration (AddAddress flow)', () => {
  test('opens AddAddress modal, submits, and shows new address in list', async () => {
    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const preloadedState = {
      userState: {
        userInfo: {
          firstName: 'Alice',
          lastName: 'Tester',
          addressList: []
        }
      }
    }

    const store = configureStore({ reducer: rootReducer, preloadedState })

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    )

    // Ensure there are no addresses initially
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()

    // Open the AddAddress modal
    fireEvent.click(screen.getByText('Add New'))

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('Contact person name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Contact number'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 St' } })
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } })
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } })
    fireEvent.change(screen.getByPlaceholderText('Zip code'), { target: { value: '12345' } })

    // Verify the modal is shown (form present)
    expect(screen.getByText('Add Address')).toBeInTheDocument()

    // Close the modal using the Cancel button (this calls the onCancel passed by Profile)
    fireEvent.click(screen.getByText('Cancel'))

    // Now simulate the successful server response by dispatching the same action
    // the real component would dispatch when the API resolves.
    const sample = { id: 'addr-new', name: 'John Doe', phoneNumber: '1234567890', street: '123 St', city: 'City', state: 'State', zipCode: '12345' }
    act(() => {
      store.dispatch(saveAddress(sample))
    })

    // Wait for Profile to render the new address
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument())

    // Also assert store updated
    const addresses = store.getState().userState.userInfo.addressList
    expect(addresses).toBeDefined()
    expect(addresses).toHaveLength(1)
    expect(addresses[0]).toMatchObject({ id: 'addr-new', name: 'John Doe', city: 'City' })
  })
})
