import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function getMyProfile() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_BASE_URL}users/profile-data`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  return data;
}

export async function updateProfilePhoto(file: File) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("photo", file);

  const { data } = await axios.put(`${API_BASE_URL}users/upload-photo`, formData, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return data;
}
