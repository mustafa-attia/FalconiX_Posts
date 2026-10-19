import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function getPostDetails(postId: string) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_BASE_URL}posts/${postId}`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
