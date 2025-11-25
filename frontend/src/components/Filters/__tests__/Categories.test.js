// import React from "react";
// import { render, fireEvent, screen } from "@testing-library/react";
// import Categories from "../Categories";

// describe("Categories Component", () => {
//   const types = [
//     { code: "t1", name: "T-Shirt" },
//     { code: "t2", name: "Shirt" },
//   ];

//   test("renders all category options", () => {
//     render(<Categories types={types} />);
//     types.forEach(type => {
//       const label = screen.getByText(type.name);
//       expect(label).toBeInTheDocument();
//     });
//   });

//   test("can check/uncheck a category checkbox", () => {
//     render(<Categories types={types} />);

//     const checkbox = screen.getByRole("checkbox", { name: "T-Shirt" });
//     expect(checkbox.checked).toBe(false);

//     fireEvent.click(checkbox);
//     expect(checkbox.checked).toBe(true);

//     fireEvent.click(checkbox);
//     expect(checkbox.checked).toBe(false);
//   });
// });


import React from "react";
import { render, screen } from "@testing-library/react";
import Categories from "../Categories";

describe("Categories Component - ISP Tests", () => {
  const partitions = [
    [], // no categories
    [{ code: "t1", name: "T-Shirt" }], // single category
    [
      { code: "t1", name: "T-Shirt" },
      { code: "t2", name: "Shirt" },
      { code: "t3", name: "Jeans" }
    ] // multiple categories
  ];

  partitions.forEach((types, index) => {
    test(`Partition ${index + 1}: ${types.length} categories`, () => {
      render(<Categories types={types} />);
      types.forEach(type => {
        expect(screen.getByText(type.name)).toBeInTheDocument();
      });
    });
  });
});
