import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getMyProfile() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${baseURL}users/profile-data`, {
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

  const { data } = await axios.put(`${baseURL}users/upload-photo`, formData, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return data;
}
