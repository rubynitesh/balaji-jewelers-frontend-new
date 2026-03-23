import api from "../api/axiosConfig";

export const saveProduct = (formData) => {
  return api.post("/api/products", formData);
};

export const getProducts = () => {
  return api.get("/api/products");
};  

export const deleteProduct = (id) => {
  return api.delete(`/api/products/${id}`);
};

export const updateProduct = (id, formData) => {
  return api.put(`/api/products/${id}`, formData);
};
