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

export async function fetchAttributeData(attributeTypeId: number) {
  try {
    const response = await axios.get(`${API_URL}/attribute/${attributeTypeId}`, { signal: newAbortSignal() });
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
    const response = await axios.get(`${API_URL}/attribute/${attributeTypeId}/${categoryId}`, { signal: newAbortSignal() });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching attribute data with category id ${categoryId} and attribute type id ${attributeTypeId}`,
      error.response?.data?.message || error.message
    );
  }
}
