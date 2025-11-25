// src/store/features/__tests__/cart.test.js
import cartReducer, { addToCart, removeFromCart, updateQuantity, deleteCart, countCartItems, selectCartItems } from "../cart";

describe("cart slice", () => {

  const initialState = { cart: [] };

  it("should return the initial state when no action is passed", () => {
    expect(cartReducer(undefined, { type: undefined })).toEqual({ cart: [] });
  });

  it("addToCart should add an item to the cart", () => {
    const product = { id: 1, name: "Red T-Shirt", quantity: 1, price: 10 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.cart).toEqual([product]);
  });

  it("removeFromCart should remove an item by productId or variantId", () => {
    const stateWithItems = {
      cart: [
        { id: 1, name: "Red T-Shirt", quantity: 2, price: 10, variant: { id: 101 } },
        { id: 2, name: "Blue Jeans", quantity: 1, price: 20, variant: { id: 102 } },
      ],
    };

    const stateAfterRemove = cartReducer(
      stateWithItems,
      removeFromCart({ productId: 1, variantId: 999 })
    );
    expect(stateAfterRemove.cart).toEqual([
      { id: 2, name: "Blue Jeans", quantity: 1, price: 20, variant: { id: 102 } },
    ]);

    // Remove by variantId
    const stateAfterRemoveVariant = cartReducer(
      stateWithItems,
      removeFromCart({ productId: 999, variantId: 102 })
    );
    expect(stateAfterRemoveVariant.cart).toEqual([
      { id: 1, name: "Red T-Shirt", quantity: 2, price: 10, variant: { id: 101 } },
    ]);
  });

  it("updateQuantity should update quantity and subtotal for the matching variant", () => {
    const stateWithItem = {
      cart: [
        { id: 1, name: "Red T-Shirt", quantity: 2, price: 10, subTotal: 20, variant: { id: 101 } },
      ],
    };

    const updatedState = cartReducer(
      stateWithItem,
      updateQuantity({ variant_id: 101, quantity: 5 })
    );

    expect(updatedState.cart[0].quantity).toBe(5);
    expect(updatedState.cart[0].subTotal).toBe(50);
  });

  it("deleteCart should empty the cart", () => {
    const stateWithItems = {
      cart: [
        { id: 1, name: "Red T-Shirt" },
        { id: 2, name: "Blue Jeans" },
      ],
    };
    const clearedState = cartReducer(stateWithItems, deleteCart());
    expect(clearedState.cart).toEqual([]);
  });

  // ISP: Testing selectors independently
  it("countCartItems should return correct number of items", () => {
    const state = {
      cartState: {
        cart: [{ id: 1 }, { id: 2 }],
      },
    };
    expect(countCartItems(state)).toBe(2);
  });

  it("selectCartItems should return cart items array", () => {
    const state = {
      cartState: {
        cart: [{ id: 1 }, { id: 2 }],
      },
    };
    expect(selectCartItems(state)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("selectCartItems should return empty array if cart is undefined", () => {
    const state = { cartState: {} };
    expect(selectCartItems(state)).toEqual([]);
  });
});
