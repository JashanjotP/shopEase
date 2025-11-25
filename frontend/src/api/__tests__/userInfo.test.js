import axios from "axios";
import { 
  fetchUserDetails, 
  addAddressAPI, 
  deleteAddressAPI, 
  fetchOrderAPI, 
  cancelOrderAPI 
} from "../userInfo";
import { API_BASE_URL } from "../constant";

// Mock axios
jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("userInfo API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetchUserDetails calls correct URL and returns data", async () => {
    const mockData = { id: "user1", name: "John" };
    axios.mockResolvedValue({ data: mockData });

    const result = await fetchUserDetails();

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/user/profile`, {
      method: "GET",
      headers: expect.any(Object),
    });
  });

  it("addAddressAPI calls correct URL and returns data", async () => {
    const mockData = { id: "addr1", street: "123 Main St" };
    axios.mockResolvedValue({ data: mockData });

    const address = { street: "123 Main St" };
    const result = await addAddressAPI(address);

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/address`, {
      method: "POST",
      data: address,
      headers: expect.any(Object),
    });
  });

  it("deleteAddressAPI calls correct URL and returns data", async () => {
    const mockData = { success: true };
    axios.mockResolvedValue({ data: mockData });

    const result = await deleteAddressAPI("addr1");

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/address/addr1`, {
      method: "DELETE",
      headers: expect.any(Object),
    });
  });

  it("fetchOrderAPI calls correct URL and returns data", async () => {
    const mockData = [{ id: "order1" }, { id: "order2" }];
    axios.mockResolvedValue({ data: mockData });

    const result = await fetchOrderAPI();

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/order/user`, {
      method: "GET",
      headers: expect.any(Object),
    });
  });

  it("cancelOrderAPI calls correct URL and returns data", async () => {
    const mockData = { success: true };
    axios.mockResolvedValue({ data: mockData });

    const result = await cancelOrderAPI("order1");

    expect(result).toEqual(mockData);
    expect(axios).toHaveBeenCalledWith(`${API_BASE_URL}/api/order/cancel/order1`, {
      method: "POST",
      headers: expect.any(Object),
    });
  });
});
