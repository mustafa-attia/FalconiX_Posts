import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getFeed() {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${baseURL}posts?limit=10`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
