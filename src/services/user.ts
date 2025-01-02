// src/services/user.ts
import api from "./api";

export const getUserInfo = async () => {
  const response = await api.get("/myuser");
  return response.data;
};

export const updateUserInfo = async (data: {
  fullName?: string;
  telephone?: string;
  email?: string;
}) => {
  const response = await api.put("/myuser/update", data);
  return response.data;
};
