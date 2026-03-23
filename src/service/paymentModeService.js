import api from "../api/axiosConfig";

export const getAllPaymentModes = () => {
  return api.get("/api/paymentMode");
};