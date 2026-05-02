import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3939",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;