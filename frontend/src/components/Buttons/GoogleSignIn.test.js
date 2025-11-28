import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoogleSignIn from './GoogleSignIn';
import { API_BASE_URL } from '../../api/constant';

// 1. Mock the constant to ensure consistent test values
jest.mock('../../api/constant', () => ({
  API_BASE_URL: 'http://localhost:8080',
}));

// 2. Mock window.location
// JSDOM does not implement window.location.href assignment by default,
// so we must mock it to verify the redirect.
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});

afterAll(() => {
  window.location = originalLocation;
});

beforeEach(() => {
  window.location.href = ''; // Reset before every test
});

describe('<GoogleSignIn />', () => {
  
  // KILLS MUTANT: BlockStatement (Component Body)
  // If the component body is empty, this test fails because the button won't exist.
  test('renders the google sign-in button', () => {
    render(<GoogleSignIn />);
    
    const button = screen.getByRole('button');
    const text = screen.getByText('Continue With Google');
    const img = screen.getByAltText('google-icon');

    expect(button).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(img).toBeInTheDocument();
  });

  // KILLS MUTANT: BlockStatement (handleClick body)
  // If the handleClick body is empty, window.location.href will remain empty, failing this test.
  test('redirects to the correct Google OAuth URL on click', () => {
    render(<GoogleSignIn />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const expectedUrl = `${API_BASE_URL}/oauth2/authorization/google`;
    expect(window.location.href).toBe(expectedUrl);
  });
});