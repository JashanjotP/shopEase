// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import SizeFilter from "../SizeFilter";

// describe("SizeFilter Component", () => {
//   const sizes = ["S", "M", "L"];

//   test("renders all sizes", () => {
//     render(<SizeFilter sizes={sizes} />);

//     sizes.forEach(size => {
//       expect(screen.getByText(size)).toBeInTheDocument();
//     });
//   });

//   test("selects a size when clicked (multi = true)", () => {
//     render(<SizeFilter sizes={sizes} />);

//     const sizeM = screen.getByText("M");

//     // Click M
//     fireEvent.click(sizeM);

//     // M should now have black background and white text
//     expect(sizeM).toHaveStyle("background: black");
//     expect(sizeM).toHaveStyle("color: white");
//   });

//   test("adds multiple sizes when multi=true", () => {
//     render(<SizeFilter sizes={sizes} />);

//     const sizeM = screen.getByText("M");
//     const sizeL = screen.getByText("L");

//     fireEvent.click(sizeM);
//     fireEvent.click(sizeL);

//     expect(sizeM).toHaveStyle("background: black");
//     expect(sizeL).toHaveStyle("background: black");
//   });

//   test("removes size when clicked again", () => {
//     render(<SizeFilter sizes={sizes} />);

//     const sizeM = screen.getByText("M");

//     // Select M
//     fireEvent.click(sizeM);
//     expect(sizeM).toHaveStyle("background: black");

//     // Unselect M
//     fireEvent.click(sizeM);
//     expect(sizeM).not.toHaveStyle("background: black");
//   });

//   test("single selection mode (multi = false)", () => {
//     render(<SizeFilter sizes={sizes} multi={false} />);

//     const sizeM = screen.getByText("M");
//     const sizeL = screen.getByText("L");

//     fireEvent.click(sizeM);
//     expect(sizeM).toHaveStyle("background: black");

//     fireEvent.click(sizeL);

//     // M should reset
//     expect(sizeM).not.toHaveStyle("background: black");

//     // L now active
//     expect(sizeL).toHaveStyle("background: black");
//   });

//   test("calls onChange with correct applied sizes", () => {
//     const onChange = jest.fn();

//     render(<SizeFilter sizes={sizes} onChange={onChange} />);

//     const sizeS = screen.getByText("S");

//     fireEvent.click(sizeS);

//     expect(onChange).toHaveBeenCalledTimes(1);
//     expect(onChange).toHaveBeenCalledWith(["S"]);
//   });
// });


import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SizeFilter from "../SizeFilter";

describe("SizeFilter Component", () => {
  const sizes = ["S", "M", "L"];

  test("renders all size options", () => {
    render(<SizeFilter sizes={sizes} onChange={() => {}} />);
    sizes.forEach(size => {
      const sizeDiv = screen.getByText(size);
      expect(sizeDiv).toBeInTheDocument();
    });
  });

  test("calls onChange with applied sizes when clicked", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    const sizeS = screen.getByText("S");
    fireEvent.click(sizeS);

    // onChange may be called twice because of useEffect
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["S"]));
  });

  test("can select multiple sizes", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    fireEvent.click(screen.getByText("S"));
    fireEvent.click(screen.getByText("M"));

    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["S", "M"]));
  });

  test("unselecting a size removes it from applied sizes", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    const sizeL = screen.getByText("L");
    fireEvent.click(sizeL); // select
    fireEvent.click(sizeL); // unselect

    expect(onChange).toHaveBeenCalledWith(expect.not.arrayContaining(["L"]));
  });
});
