import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ColorsFilter, { colorSelector } from "../ColorsFilter";

describe("ColorsFilter Component", () => {
  const mockColors = ["Red", "Blue", "Green"];

  test("renders all color options", () => {
    render(<ColorsFilter colors={mockColors} />);
    mockColors.forEach((color) => {
      const colorButton = screen.getByTestId(`color-${color}`);
      expect(colorButton).toBeInTheDocument();
    });
  });

  // KILLS MUTANT 4 (ObjectLiteral)
  test("renders the correct background color for each option", () => {
    render(<ColorsFilter colors={mockColors} />);
    
    const redButton = screen.getByTestId("color-Red");
    // We check that the style prop is actually applied
    expect(redButton).toHaveStyle(`background: ${colorSelector["Red"]}`);
  });

  test("clicking a color selects it (label turns black)", () => {
    render(<ColorsFilter colors={mockColors} />);
    const redButton = screen.getByTestId("color-Red");
    const redLabel = screen.getByText("Red");

    expect(redLabel).not.toHaveStyle("color: black");
    fireEvent.click(redButton);
    expect(redLabel).toHaveStyle("color: black");
  });

  test("clicking a selected color unselects it", () => {
    render(<ColorsFilter colors={mockColors} />);
    const blueButton = screen.getByTestId("color-Blue");
    const blueLabel = screen.getByText("Blue");

    fireEvent.click(blueButton);
    expect(blueLabel).toHaveStyle("color: black");
    fireEvent.click(blueButton);
    expect(blueLabel).not.toHaveStyle("color: black");
  });

  test("can select multiple colors independently", () => {
    render(<ColorsFilter colors={mockColors} />);
    const redButton = screen.getByTestId("color-Red");
    const greenButton = screen.getByTestId("color-Green");
    const redLabel = screen.getByText("Red");
    const greenLabel = screen.getByText("Green");

    fireEvent.click(redButton);
    fireEvent.click(greenButton);

    expect(redLabel).toHaveStyle("color: black");
    expect(greenLabel).toHaveStyle("color: black");
  });

  // KILLS MUTANTS 2 & 3 (ArrowFunction & ConditionalExpression)
  test("unselecting one color does not remove other selected colors", () => {
    render(<ColorsFilter colors={mockColors} />);
    
    const redButton = screen.getByTestId("color-Red");
    const blueButton = screen.getByTestId("color-Blue");
    const redLabel = screen.getByText("Red");
    const blueLabel = screen.getByText("Blue");

    // 1. Select both
    fireEvent.click(redButton);
    fireEvent.click(blueButton);

    // Verify both selected
    expect(redLabel).toHaveStyle("color: black");
    expect(blueLabel).toHaveStyle("color: black");

    // 2. Unselect ONLY Red
    fireEvent.click(redButton);

    // 3. Verify Red is gone, but Blue REMAINS
    expect(redLabel).not.toHaveStyle("color: black");
    expect(blueLabel).toHaveStyle("color: black"); 
    // ^ The mutant would fail here because it clears the whole array
  });
});