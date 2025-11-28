import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Shop from './Shop';
import { fetchCategories } from './api/fetchCategories';
import { loadCategories } from './store/features/category';
import { setLoading } from './store/features/common';

// Mock Dependencies
jest.mock('./components/HeroSection/HeroSection', () => () => <div data-testid="hero-section">Hero Section</div>);
jest.mock('./components/Sections/NewArrivals', () => () => <div data-testid="new-arrivals">New Arrivals</div>);
jest.mock('./components/Sections/Categories/Category', () => ({ title }) => <div data-testid="category-section">{title}</div>);
jest.mock('./components/Footer/Footer', () => ({ content }) => <div data-testid="footer">{content?.text}</div>);
jest.mock('./api/fetchCategories');
jest.mock('./data/content.json', () => ({
  pages: {
    shop: {
      sections: [
        { title: 'Men\'s Clothing' },
        { title: 'Women\'s Clothing' },
        { title: 'Accessories' }
      ]
    }
  },
  footer: {
    text: 'Footer Content'
  }
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Shop Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      categoryState: { categories: [] },
      commonState: { loading: false }
    });
    store.clearActions();
    jest.clearAllMocks();
  });

  test('renders all main sections', () => {
    fetchCategories.mockResolvedValue([{ id: 1, title: 'Men' }]);
    
    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('new-arrivals')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('dispatches loadCategories with fetched data on success', async () => {
    const mockCategories = [
      { id: 1, title: 'Men' },
      { id: 2, title: 'Women' }
    ];
    fetchCategories.mockResolvedValue(mockCategories);

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledTimes(1);
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(loadCategories(mockCategories));
  });

  test('dispatches setLoading(false) after successful fetch', async () => {
    fetchCategories.mockResolvedValue([{ id: 1, title: 'Men' }]);

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(setLoading(false));
    });
  });

  test('dispatches setLoading(false) after failed fetch', async () => {
    fetchCategories.mockRejectedValue(new Error('API Error'));

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(setLoading(false));
    });
  });

  test('does not dispatch loadCategories when fetch fails', async () => {
    fetchCategories.mockRejectedValue(new Error('API Error'));

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalled();
    });

    const actions = store.getActions();
    const loadCategoriesActions = actions.filter(action => action.type === loadCategories({}).type);
    expect(loadCategoriesActions).toHaveLength(0);
  });

  test('renders all category sections from content.json', () => {
    fetchCategories.mockResolvedValue([]);

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    expect(screen.getByText('Men\'s Clothing')).toBeInTheDocument();
    expect(screen.getByText('Women\'s Clothing')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
    expect(screen.getAllByTestId('category-section')).toHaveLength(3);
  });

  test('passes footer content to Footer component', () => {
    fetchCategories.mockResolvedValue([]);

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  test('refetches categories when component remounts', async () => {
    fetchCategories.mockResolvedValue([{ id: 1, title: 'Men' }]);

    const { unmount } = render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledTimes(1);
    });

    unmount();
    jest.clearAllMocks();

    render(
      <Provider store={store}>
        <Shop />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledTimes(1);
    });
  });
});