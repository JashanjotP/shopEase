// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import ColorsFilter, { colorSelector } from "../../Filters/ColorsFilter";

// describe("ColorsFilter Component", () => {
//   const mockColors = ["Red", "Blue", "Green"];

//   test("renders all colors", () => {
//     render(<ColorsFilter colors={mockColors} />);

//     mockColors.forEach((color) => {
//       expect(screen.getByText(color)).toBeInTheDocument();
//     });
//   });

//   test("each color box uses correct background color", () => {
//     render(<ColorsFilter colors={mockColors} />);

//     mockColors.forEach((color) => {
//       const box = screen.getAllByRole("button")[mockColors.indexOf(color)];

//       expect(box).toHaveStyle(`background: ${colorSelector[color]}`);
//     });
//   });

//   test("selects a color on click", () => {
//     render(<ColorsFilter colors={mockColors} />);

//     const redBox = screen.getAllByRole("button")[0];
//     const redLabel = screen.getByText("Red");

//     fireEvent.click(redBox);

//     expect(redLabel).toHaveStyle("color: black");
//   });

//   test("deselects a color when clicked again", () => {
//     render(<ColorsFilter colors={mockColors} />);

//     const redBox = screen.getAllByRole("button")[0];
//     const redLabel = screen.getByText("Red");

//     fireEvent.click(redBox); // select
//     fireEvent.click(redBox); // unselect

//     expect(redLabel).toHaveStyle("color: ");
//   });

//   test("multiple colors can be selected", () => {
//     render(<ColorsFilter colors={mockColors} />);

//     const [redBox, blueBox] = screen.getAllByRole("button");

//     const redLabel = screen.getByText("Red");
//     const blueLabel = screen.getByText("Blue");

//     fireEvent.click(redBox);
//     fireEvent.click(blueBox);

//     expect(redLabel).toHaveStyle("color: black");
//     expect(blueLabel).toHaveStyle("color: black");
//   });
// });


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

  test("clicking a color selects it (label turns black)", () => {
    render(<ColorsFilter colors={mockColors} />);

    const redButton = screen.getByTestId("color-Red");
    const redLabel = screen.getByText("Red");

    // Initially unselected
    expect(redLabel).toHaveStyle("color: ");

    // Select color
    fireEvent.click(redButton);

    // Selected label should turn black
    expect(redLabel).toHaveStyle("color: black");
  });

  test("clicking a selected color unselects it", () => {
    render(<ColorsFilter colors={mockColors} />);

    const blueButton = screen.getByTestId("color-Blue");
    const blueLabel = screen.getByText("Blue");

    // Select
    fireEvent.click(blueButton);
    expect(blueLabel).toHaveStyle("color: black");

    // Unselect
    fireEvent.click(blueButton);
    expect(blueLabel).toHaveStyle("color: ");
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
});
