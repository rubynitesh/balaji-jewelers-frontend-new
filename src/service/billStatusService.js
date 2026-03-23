import api from "../api/axiosConfig";

export const getAllBillStatus = () => {
  return api.get("/api/billStatus");
};