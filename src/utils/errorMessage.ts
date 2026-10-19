import axios from "axios";

type ApiErrorPayload = {
  message?: unknown;
  errors?: unknown;
};

function messageFromPayload(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const { message, errors } = payload as ApiErrorPayload;
  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }
  if (Array.isArray(message)) {
    const messages = message.filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
    if (messages.length) return messages.join(" ");
  }
  if (typeof errors === "string" && errors.trim()) {
    return errors.trim();
  }
  if (Array.isArray(errors)) {
    const messages = errors.filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
    if (messages.length) return messages.join(" ");
  }

  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = messageFromPayload(error.response?.data);
    if (responseMessage) return responseMessage;
    return error.response ? fallback : "Unable to connect. Check your connection and try again.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
