import API from "./api";

export const getAllProductsApi = (page = 1, limit = 10) =>
  API.get(`/products?page=${page}&limit=${limit}`);

export const getSingleProductApi = (id) =>
  API.get(`/products/${id}`);
