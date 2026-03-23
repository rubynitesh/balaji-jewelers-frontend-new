import api from "../api/axiosConfig";

export const getAllPaymentStatus = () => {
  return api.get("/Api/GetPaymentStatus");
};