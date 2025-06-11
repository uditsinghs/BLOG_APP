// 📁 src/api/authApi.js
import { axiosInstance } from "@/utils/axios";

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosInstance.post("users/login", { email, password });
  return data;
};
export const registerUser = async ({ userData }) => {
  const { data } = await axiosInstance.post("users/register", userData);
  return data;
};
export const getUser = async () => {
  const { data } = await axiosInstance.get("users/profile");
  return data.user;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("users/logout");
  return data;
};

export const updateBio = async ({ bio, userid }) => {
  const { data } = await axiosInstance.put("/users/update", { bio, userid });
  return data;
};

export const updateProfilePhoto = async (formData) => {
  const { data } = await axiosInstance.put("/users/update/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

