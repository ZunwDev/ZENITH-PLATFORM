import axios from "axios";

export const API_URL = "http://localhost:8080/api";

export function newAbortSignal() {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000 || 0);
  return abortController.signal;
}

const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
    signal: newAbortSignal(),
  });
};

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
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/users/session/${sessionToken}`));
}

export async function fetchFilterData() {
  const axiosInstance = createAxiosInstance();
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
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/products/${id}`));
}

export async function fetchProductTypeDataByCategoryId(id) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/product_types/${id}`));
}

export async function fetchBannerDataById(id) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/banners/${id}`));
}

export async function fetchAttributeData(attributeTypeId) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/attributes/${attributeTypeId}`));
}

export async function fetchAttributeTypes() {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get("/attribute_types"));
}

export async function fetchAttributes() {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get("/attributes"));
}

export async function fetchCategoryIdByName(name) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/categories/${name}`));
}

export async function fetchBrandIdByName(name) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/brands/${name}`));
}

export async function fetchStatusByName(name) {
  const axiosInstance = createAxiosInstance();
  return handleRequest(axiosInstance.get(`/status/${name}`));
}
