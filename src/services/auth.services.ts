import axios from "axios";
import type { RegisterFormType } from "../schema/register";
import type { LoginFormType } from "../schema/login";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function registerUser(formData: RegisterFormType) {
  const data = await axios.post(`${baseURL}users/signup`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function loginUser(formData: LoginFormType) {
  const data = await axios.post(`${baseURL}users/signin`, formData, {
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
    `${baseURL}users/change-password`,
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
