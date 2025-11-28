import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriceFilter from '../PriceFilter';

// Mock the third-party library. 
// This allows us to control the inputs and spy on the props passed to it.
jest.mock('react-range-slider-input', () => {
  return function DummySlider({ defaultValue, onInput }) {
    return (
      <div data-testid="mock-slider">
        {/* Render the received defaultValue so we can assert on it */}
        <span data-testid="slider-default-value">{JSON.stringify(defaultValue)}</span>
        
        {/* A button to simulate the user dragging the slider */}
        <button 
          data-testid="slider-change-btn" 
          onClick={() => onInput([50, 400])}
        >
          Simulate Slide
        </button>
      </div>
    );
  };
});

describe('PriceFilter Component', () => {
  test('renders with correct initial state and passes defaults to slider', () => {
    render(<PriceFilter />);

    const minInput = screen.getByPlaceholderText('min');
    const maxInput = screen.getByPlaceholderText('max');

    // Kills [Survived] ObjectLiteral in useState({})
    // We expect explicit '10' and '250', not just "any string"
    expect(minInput.value).toBe('10');
    expect(maxInput.value).toBe('250');

    // Kills [Survived] ArrayDeclaration in defaultValue={[]}
    // We verified the component passed [10, 250] to the slider, not an empty array.
    const sliderDefault = screen.getByTestId('slider-default-value');
    expect(sliderDefault.textContent).toBe('[10,250]'); 
  });

  test('updates input values when slider triggers onInput', () => {
    render(<PriceFilter />);

    const minInput = screen.getByPlaceholderText('min');
    const maxInput = screen.getByPlaceholderText('max');
    const changeBtn = screen.getByTestId('slider-change-btn');

    // Simulate the slider moving to 50 - 400
    fireEvent.click(changeBtn);

    // Kills [Survived] ArrowFunction: onInput={() => undefined}
    // If the handler was removed, these values would remain 10 and 250.
    
    // Kills [NoCoverage] ObjectLiteral: setRange({})
    // If the handler set empty state, these would be empty/undefined.
    expect(minInput.value).toBe('50');
    expect(maxInput.value).toBe('400');
  });
});