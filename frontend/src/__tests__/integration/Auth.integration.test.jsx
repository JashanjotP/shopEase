import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import commonReducer from '../../store/features/common'
import productReducer from '../../store/features/product'
import cartReducer from '../../store/features/cart'
import categoryReducer from '../../store/features/category'
import userReducer from '../../store/features/user'
import AuthenticationWrapper from '../../pages/AuthenticationWrapper'
import OAuth2LoginCallback from '../../pages/OAuth2LoginCallback'

describe('Authentication / OAuth flows', () => {
  beforeEach(() => {
    localStorage.removeItem('authToken')
  })

  test('OAuth2 callback with token saves token and navigates to home', async () => {
    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const store = configureStore({ reducer: rootReducer })

    // ensure window.location.search is populated because the component reads window.location
    window.history.pushState({}, '', '/oauth2/callback?token=abc123')

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/oauth2/callback?token=abc123"]}>
          <Routes>
            <Route path="/" element={<div>home</div>} />
            <Route path="/v1/login" element={<div>login</div>} />
            <Route path="/oauth2/callback" element={<OAuth2LoginCallback />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => expect(screen.getByText('home')).toBeInTheDocument())
    expect(localStorage.getItem('authToken')).toBe('abc123')
  })

  test('OAuth2 callback without token redirects to login', async () => {
    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const store = configureStore({ reducer: rootReducer })

    // ensure window.location.search is empty for this test
    window.history.pushState({}, '', '/oauth2/callback')

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/oauth2/callback"]}>
          <Routes>
            <Route path="/" element={<div>home</div>} />
            <Route path="/v1/login" element={<div>login</div>} />
            <Route path="/oauth2/callback" element={<OAuth2LoginCallback />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => expect(screen.getByText('login')).toBeInTheDocument())
    expect(localStorage.getItem('authToken')).toBeNull()
  })

  test('AuthenticationWrapper shows spinner when loading', async () => {
    const rootReducer = combineReducers({
      productState: productReducer,
      cartState: cartReducer,
      categoryState: categoryReducer,
      commonState: commonReducer,
      userState: userReducer,
    })

    const preloadedState = {
      commonState: { loading: true }
    }

    const store = configureStore({ reducer: rootReducer, preloadedState })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<AuthenticationWrapper />}>
              <Route index element={<div>auth-child</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    // Spinner renders an element with role="status"
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
  })
})
