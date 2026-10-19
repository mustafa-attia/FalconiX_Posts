import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getComments(postId: string) {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${baseURL}posts/${postId}/comments`, {
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
    `${baseURL}posts/${postId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
