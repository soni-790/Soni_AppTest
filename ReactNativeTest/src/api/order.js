import API from "./api";

export const createOrderApi = (data, token) =>
  API.post("/orders", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyOrdersApi = (token) =>
  API.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrderByIdApi = (id, token) =>
  API.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
