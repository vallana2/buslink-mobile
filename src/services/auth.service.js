import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (name, email, phone, password) => {
  const response = await api.post("/auth/register", { name, email, phone, password });
  return response.data;
};