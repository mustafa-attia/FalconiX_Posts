import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function getComments(postId: string) {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${API_BASE_URL}posts/${postId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function CreateComment(postId: string, content: string) {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${API_BASE_URL}posts/${postId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
