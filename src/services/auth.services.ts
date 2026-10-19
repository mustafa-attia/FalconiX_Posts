import axios from "axios";
import type { RegisterFormType } from "../schema/register";
import type { LoginFormType } from "../schema/login";
import { API_BASE_URL } from "./apiConfig";

export async function registerUser(formData: RegisterFormType) {
  const data = await axios.post(`${API_BASE_URL}users/signup`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function loginUser(formData: LoginFormType) {
  const data = await axios.post(`${API_BASE_URL}users/signin`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export type ChangePasswordResponse = {
  token?: string;
  data?: {
    token?: string;
  };
};

export async function changePassword(payload: {
  password: string;
  newPassword: string;
}) {
  const token = localStorage.getItem("token");
  const { data } = await axios.patch<ChangePasswordResponse>(
    `${API_BASE_URL}users/change-password`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    },
  );

  return data;
}
