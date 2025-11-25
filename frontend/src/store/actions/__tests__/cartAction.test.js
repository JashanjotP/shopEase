// src/store/actions/__tests__/cartAction.test.js
import {
    addItemToCartAction,
    updateItemToCartAction,
    delteItemFromCartAction,
    clearCart,
  } from "../cartAction";
  
  import { addToCart, deleteCart, removeFromCart, updateQuantity } from "../../features/cart";
  
  // Mock cart slice actions
  jest.mock("../../features/cart", () => ({
    addToCart: jest.fn((item) => ({ type: "ADD_TO_CART", payload: item })),
    updateQuantity: jest.fn((item) => ({ type: "UPDATE_QUANTITY", payload: item })),
    removeFromCart: jest.fn((item) => ({ type: "REMOVE_FROM_CART", payload: item })),
    deleteCart: jest.fn(() => ({ type: "DELETE_CART" })),
  }));
  
  describe("Cart Actions", () => {
    let dispatchMock;
    let stateMock;
    let localStorageSetItemSpy;
    let localStorageRemoveItemSpy;
  
    beforeEach(() => {
      dispatchMock = jest.fn();
      stateMock = jest.fn(() => ({
        cartState: {
          cart: [{ variant_id: 1, quantity: 2 }],
        },
      }));
      localStorageSetItemSpy = jest.spyOn(Storage.prototype, "setItem");
      localStorageRemoveItemSpy = jest.spyOn(Storage.prototype, "removeItem");
      jest.clearAllMocks();
    });
  
    it("addItemToCartAction dispatches addToCart and updates localStorage", () => {
      const product = { id: 1, name: "Red T-Shirt" };
      const thunk = addItemToCartAction(product);
      thunk(dispatchMock, stateMock);
  
      expect(dispatchMock).toHaveBeenCalledWith(addToCart(product));
      expect(localStorageSetItemSpy).toHaveBeenCalledWith(
        "cart",
        JSON.stringify(stateMock().cartState.cart)
      );
    });
  
    it("updateItemToCartAction dispatches updateQuantity and updates localStorage", () => {
      const product = { variant_id: 1, quantity: 5 };
      const thunk = updateItemToCartAction(product);
      thunk(dispatchMock, stateMock);
  
      expect(dispatchMock).toHaveBeenCalledWith(
        updateQuantity({ variant_id: 1, quantity: 5 })
      );
      expect(localStorageSetItemSpy).toHaveBeenCalledWith(
        "cart",
        JSON.stringify(stateMock().cartState.cart)
      );
    });
  
    it("delteItemFromCartAction dispatches removeFromCart and updates localStorage", () => {
      const payload = { variant_id: 1 };
      const thunk = delteItemFromCartAction(payload);
      thunk(dispatchMock, stateMock);
  
      expect(dispatchMock).toHaveBeenCalledWith(removeFromCart(payload));
      expect(localStorageSetItemSpy).toHaveBeenCalledWith(
        "cart",
        JSON.stringify(stateMock().cartState.cart)
      );
    });
  
    it("clearCart dispatches deleteCart and removes cart from localStorage", () => {
      const thunk = clearCart();
      thunk(dispatchMock, stateMock);
  
      expect(dispatchMock).toHaveBeenCalledWith(deleteCart());
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith("cart");
    });
  
    it("handles state with empty cart gracefully", () => {
      stateMock = jest.fn(() => ({ cartState: { cart: [] } }));
      const product = { id: 1 };
      const thunk = addItemToCartAction(product);
      thunk(dispatchMock, stateMock);
  
      expect(localStorageSetItemSpy).toHaveBeenCalledWith("cart", JSON.stringify([]));
    });
  });
  