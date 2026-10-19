import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getPostDetails(postId: string) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${baseURL}posts/${postId}`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
