import { axiosInstance } from "@/utils/axios";

export const fetchPaginatedBlogs = async ({ page = 1, limit = 5 }) => {
  const { data } = await axiosInstance.get(`posts/blogs?page=${page}&limit=${limit}`);
  return data;
};
export const addComment = async ({ content, postId }) => {
  const { data } = await axiosInstance.put(`posts/comment/${postId}`, { content });
  return data;
};
