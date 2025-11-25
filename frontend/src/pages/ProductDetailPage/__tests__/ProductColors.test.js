import React from "react";
import { render, screen } from "@testing-library/react";
import ProductColors from "../ProductColors";  // relative to __tests__ folder
import { colorSelector } from "../../../components/Filters/ColorsFilter";

describe("ProductColors Component", () => {
  const colors = ["Black", "Red", "Blue"];

  test("renders all color circles", () => {
    render(<ProductColors colors={colors} />);

    colors.forEach((color) => {
      const colorDiv = screen.getByTestId(`color-${color}`);
      expect(colorDiv).toBeInTheDocument();
      expect(colorDiv).toHaveStyle(`background: ${colorSelector[color]}`);
    });
  });

  test("renders no circles if colors array is empty", () => {
    render(<ProductColors colors={[]} />);
    const divs = screen.queryAllByTestId(/color-/i);
    expect(divs.length).toBe(0);
  });
});
