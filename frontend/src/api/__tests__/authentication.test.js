// src/api/__tests__/authentication.test.js
import axios from "axios";
import { loginAPI, registerAPI, verifyAPI } from "../authentication";
import { API_BASE_URL } from "../constant";

// Mock axios
jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Authentication API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loginAPI calls correct URL and returns data", async () => {
    const mockResponse = { token: "abc123" };
    axios.mockResolvedValue({ data: mockResponse });

    const body = { email: "test@test.com", password: "123456" };
    const result = await loginAPI(body);

    expect(result).toEqual(mockResponse);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      data: body,
    });
  });

  it("registerAPI calls correct URL and returns data", async () => {
    const mockResponse = { id: 1, email: "new@test.com" };
    axios.mockResolvedValue({ data: mockResponse });

    const body = { email: "new@test.com", password: "123456", name: "Test" };
    const result = await registerAPI(body);

    expect(result).toEqual(mockResponse);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      data: body,
    });
  });

  it("verifyAPI calls correct URL and returns data", async () => {
    const mockResponse = { verified: true };
    axios.mockResolvedValue({ data: mockResponse });

    const body = { email: "test@test.com", code: "1234" };
    const result = await verifyAPI(body);

    expect(result).toEqual(mockResponse);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/verify`, {
      method: "POST",
      data: body,
    });
  });
});
