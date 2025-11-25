// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import ProductCard from "../ProductCard";
// import { BrowserRouter as Router } from "react-router-dom";

// describe("ProductCard Component", () => {
//   const product = {
//     id: 1,
//     title: "T-Shirt",
//     thumbnail: "/img/tshirt.jpg",
//     price: 20,
//     slug: "t-shirt",
//   };

//   test("renders product info", () => {
//     render(
//       <Router>
//         <ProductCard {...product} />
//       </Router>
//     );

//     expect(screen.getByText(product.title)).toBeInTheDocument();
//     expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
//     expect(screen.getByRole("img", { name: product.title })).toBeInTheDocument();
//   });

//   test("handles favorite button click", () => {
//     render(
//       <Router>
//         <ProductCard {...product} />
//       </Router>
//     );

//     const favButton = screen.getByRole("button");
//     fireEvent.click(favButton);
//   });

//   test("link points to correct product page", () => {
//     render(
//       <Router>
//         <ProductCard {...product} />
//       </Router>
//     );

//     const link = screen.getByRole("link");
//     expect(link).toHaveAttribute("href", `/product/${product.slug}`);
//   });
// });
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../ProductCard";
import { BrowserRouter as Router } from "react-router-dom";

// Helper to render ProductCard inside Router
const renderCard = (product) =>
  render(
    <Router>
      <ProductCard {...product} />
    </Router>
  );

describe("ProductCard Component - ISP Tests", () => {
  const products = [
    {
      id: 1,
      title: "T-Shirt",
      thumbnail: "/img/tshirt.jpg",
      price: 20,
      slug: "t-shirt",
    },
    {
      id: 2,
      title: "",
      thumbnail: "",
      price: 0,
      slug: "",
    },
  ];

  test("Partition 1: renders product with full info", () => {
    renderCard(products[0]);

    // Title
    const titleElement = screen.getByText(products[0].title);
    expect(titleElement).toBeInTheDocument();

    // Price
    expect(screen.getByText(`$${products[0].price}`)).toBeInTheDocument();

    // Image
    const img = screen.getByRole("img", { name: products[0].title });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", products[0].thumbnail);

    // Link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/product/${products[0].slug}`);

    // Favorite button click
    const favButton = screen.getByRole("button");
    fireEvent.click(favButton); // just logs "Click button"
  });

  test("Partition 2: renders product with missing info", () => {
    const { container } = renderCard(products[1]);
  
    // Title <p> exists even if empty
    const titleElement = container.querySelector(".flex.flex-col.pt-2 > p");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe(""); // empty
  
    // Price = 0
    expect(screen.getByText("$0")).toBeInTheDocument();
  
    // Link renders even if slug is empty
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/product/");
  
    // Image exists even if src & alt are empty
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "");
    expect(img).toHaveAttribute("alt", "");
  });
});
