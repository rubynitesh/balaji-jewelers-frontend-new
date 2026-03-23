import api from "../api/axiosConfig";


export const getAllRoles = async() => {
  const response = await api.get("/api/role");
  return response.data;
}