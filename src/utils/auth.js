export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");
export const getUserId = () => localStorage.getItem("name");


export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
