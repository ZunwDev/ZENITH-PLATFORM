import { API_URL } from "./constants";
import axios from "axios";
import { newAbortSignal } from "./utils";

export async function fetchSessionData(sessionToken) {
  try {
    if (sessionToken) {
      const response = await axios.get(`${API_URL}/users/session/${sessionToken}`, {
        signal: newAbortSignal(5000),
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    return [];
  }
}

export async function DebouncedBrandsAndCategories() {
  try {
    const [categoriesResponse, brandsResponse, brandsNonZeroResponse] = await Promise.all([
      axios.get(`${API_URL}/categories`, {
        signal: newAbortSignal(5000),
      }),
      axios.get(`${API_URL}/brands`, {
        signal: newAbortSignal(5000),
      }),
      axios.get(`${API_URL}/brands/nonzero`, {
        signal: newAbortSignal(5000),
      }),
    ]);
    const categories = categoriesResponse.data;
    const brands = brandsResponse.data;
    const brandsNonZero = brandsNonZeroResponse.data;
    return [categories, brands, brandsNonZero];
  } catch (error) {
    console.error("Error fetching categories and brands:", error.response?.data?.message || error.message);
    return [[], []];
  }
}
