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

export async function getCategories() {
  try {
    const response = await axios.get(`${API_URL}/products/category`, {
      signal: newAbortSignal(5000),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    const response = await axios.get(`${API_URL}/products/brand`, {
      signal: newAbortSignal(5000),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return [];
  }
}
