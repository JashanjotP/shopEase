// src/api/__tests__/fetchProducts.test.js
import axios from "axios";
import { getAllProducts, getProductBySlug } from "../fetchProducts";
import { API_BASE_URL, API_URLS } from "../constant";

// Mock axios as a callable function
jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("fetchProducts API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAllProducts calls correct URL and returns data", async () => {
    const mockData = [{ id: 1, name: "Red T-Shirt" }];
    axios.mockResolvedValue({ data: mockData });

    const result = await getAllProducts(1);

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL + API_URLS.GET_PRODUCTS}?categoryId=1`, {
      method: "GET",
    });
  });

  it("getAllProducts includes typeId if provided", async () => {
    const mockData = [{ id: 2, name: "Blue Jeans" }];
    axios.mockResolvedValue({ data: mockData });

    const result = await getAllProducts(1, 5);

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL + API_URLS.GET_PRODUCTS}?categoryId=1&typeId=5`, {
      method: "GET",
    });
  });

  it("getProductBySlug calls correct URL and returns first item", async () => {
    const mockData = [{ id: 3, name: "Red Dress" }];
    axios.mockResolvedValue({ data: mockData });

    const result = await getProductBySlug("red-dress");

    expect(result).toEqual(mockData[0]);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL + API_URLS.GET_PRODUCTS}?slug=red-dress`, {
      method: "GET",
    });
  });
});
