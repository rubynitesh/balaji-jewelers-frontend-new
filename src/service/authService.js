import api from "../api/axiosConfig";

export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/login", loginData);
  return response.data;
};


export const ragistarUser = async(userForm) => {
  const response = await api.post("/api/auth/register",userForm);
  return response.data;
}

export const getAllUsers = async() => {
  const response = await api.get("/api/auth/getAllUsers");
  return response.data;
}

export const resetPassword = async(email,newPassword) => {
  const response = await api.post("/api/auth/reset-password", { email, newPassword });
  return response.data;
}