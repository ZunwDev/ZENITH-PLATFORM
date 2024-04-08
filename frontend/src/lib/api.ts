import axios from "axios";
import { newAbortSignal } from "./utils";

export const API_URL = "http://localhost:8080/api";

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
    const [categoriesResponse, brandsResponse, brandsNonZeroResponse, statusResponse] = await Promise.all([
      axios.get(`${API_URL}/categories`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/brands`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/brands/nonzero`, {
        signal: newAbortSignal(),
      }),
      axios.get(`${API_URL}/status`),
    ]);
    const categories = categoriesResponse.data;
    const brands = brandsResponse.data;
    const brandsNonZero = brandsNonZeroResponse.data;
    const status = statusResponse.data;
    return [categories, brands, brandsNonZero, status];
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

export async function fetchAttributeData(attributeTypeId: number) {
  try {
    const response = await axios.get(`${API_URL}/attributes/${attributeTypeId}`, { signal: newAbortSignal() });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching attribute data with attribute type id ${attributeTypeId}`,
      error.response?.data?.message || error.message
    );
  }
}
export async function fetchAttributeDataWithCategoryId(categoryId: number, attributeTypeId: number) {
  try {
    const response = await axios.get(`${API_URL}/attributes/${attributeTypeId}/${categoryId}`, { signal: newAbortSignal() });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching attribute data with category id ${categoryId} and attribute type id ${attributeTypeId}`,
      error.response?.data?.message || error.message
    );
  }
}

export async function fetchAttributeTypes() {
  try {
    const response = await axios.get(`${API_URL}/attribute_types`, { signal: newAbortSignal() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching attribute types`, error.response?.data?.message || error.message);
  }
}

export async function fetchAttributes() {
  try {
    const response = await axios.get(`${API_URL}/attributes`, { signal: newAbortSignal() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching attributes`, error.response?.data?.message || error.message);
  }
}
