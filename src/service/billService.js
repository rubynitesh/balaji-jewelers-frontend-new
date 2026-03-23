import api from "../api/axiosConfig";

// Create Bill
export const createBill = (formData) => {
  return api.post("/api/bills", formData);
};

// Get All Bills
export const getAllBills = () => {
  return api.get("/api/bills");
};

// Delete Bill
export const deleteBill = (id) => {
  return api.delete(`/api/bills/${id}`);
};

// Update Bill
export const updateBill = (id, formData) => {
  return api.put(`/api/bills/${id}`, formData);
};

