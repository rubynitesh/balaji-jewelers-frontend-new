import api from "../api/axiosConfig";

export const getCategories = () => {
  return api.get("/api/categories");
};

export const createCategory = (data) => {
  return api.post("/api/categories", data);
};

export const deleteCategory = (id) => {
  return api.delete(`/api/categories/${id}`);
};
