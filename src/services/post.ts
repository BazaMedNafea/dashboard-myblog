// src/services/post.ts
import api from "./api";

interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
  categoryIds?: number[];
  tagIds?: number[];
}

interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
  categoryIds?: number[];
  tagIds?: number[];
}

export const createPost = async (data: CreatePostData) => {
  const response = await api.post("/mypost/create", data);
  return response.data;
};

export const updatePost = async (postId: number, data: UpdatePostData) => {
  const response = await api.put(`/mypost/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await api.delete(`/mypost/${postId}`);
  return response.data;
};

export const getUserPosts = async () => {
  const response = await api.get("/mypost/get");
  return response.data;
};
