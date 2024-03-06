import { API_URL } from "./constants";
import axios from "axios";
import { newAbortSignal } from "./utils";

export async function fetchSessionData(sessionToken) {
  try {
    if (sessionToken) {
      const response = await axios.get(`${API_URL}/users/session/${sessionToken}`, {
        signal: newAbortSignal(),
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching session data:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function fetchFilterData() {
  try {
    const [categoriesResponse, brandsResponse, brandsNonZeroResponse, archivedResponse] = await Promise.all([
      axios.get(`${API_URL}/categories`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/brands`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/brands/nonzero`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/archived`),
    ]);
    const categories = categoriesResponse.data;
    const brands = brandsResponse.data;
    const brandsNonZero = brandsNonZeroResponse.data;
    const archived = archivedResponse.data;
    return [categories, brands, brandsNonZero, archived];
  } catch (error) {
    console.error("Error fetching filters:", error.response?.data?.message || error.message);
    return [[], []];
  }
}

export async function fetchProductDataById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, { signal: newAbortSignal() });
    return response;
  } catch (error) {
    console.error(`Error fetching product data with id ${id}`, error.response?.data?.message || error.message);
  }
}
