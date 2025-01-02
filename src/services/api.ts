// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/", // Replace with your backend URL
  withCredentials: true, // For sending cookies (e.g., for authentication)
});

export default api;
