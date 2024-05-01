import axios from "axios";
import { newAbortSignal } from "./utils";

export const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  signal: newAbortSignal(),
});

async function handleRequest(request) {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data?.message || error.message);
    throw error;
  }
}

export async function fetchSessionData(sessionToken) {
  if (!sessionToken) return [];
  return handleRequest(axiosInstance.get(`/users/session/${sessionToken}`));
}

export async function fetchFilterData() {
  const requests = {
    categories: axiosInstance.get("/categories"),
    brands: axiosInstance.get("/brands"),
    brandsNonZero: axiosInstance.get("/brands/nonzero"),
    status: axiosInstance.get("/status"),
    productTypes: axiosInstance.get("/product_types"),
  };

  const responses = await Promise.all(Object.values(requests));
  const responseData = Object.values(responses).map((response) => response.data);

  return {
    categories: responseData[0],
    brands: responseData[1],
    brandsNonZero: responseData[2],
    status: responseData[3],
    productTypes: responseData[4],
  };
}

export async function fetchProductDataById(id) {
  return handleRequest(axiosInstance.get(`/products/${id}`));
}

export async function fetchProductTypeDataByCategoryId(id) {
  return handleRequest(axiosInstance.get(`/product_types/${id}`));
}

export async function fetchBannerDataById(id) {
  return handleRequest(axiosInstance.get(`/banners/${id}`));
}

export async function fetchAttributeData(attributeTypeId) {
  return handleRequest(axiosInstance.get(`/attributes/${attributeTypeId}`));
}

export async function fetchAttributeTypes() {
  return handleRequest(axiosInstance.get("/attribute_types"));
}

export async function fetchAttributes() {
  return handleRequest(axiosInstance.get("/attributes"));
}
