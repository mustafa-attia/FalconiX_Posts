import axios from "axios";

function messageFromPayload(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    const message = payload.trim();
    return message.startsWith("<") ? null : message;
  }

  if (Array.isArray(payload)) {
    const messages = payload
      .map(messageFromPayload)
      .filter((message): message is string => message !== null);
    return messages.length ? messages.join(" ") : null;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  for (const key of ["message", "error", "errors", "detail", "data"]) {
    const message = messageFromPayload(record[key]);
    if (message) return message;
  }

  const fieldMessages = Object.values(record)
    .map(messageFromPayload)
    .filter((message): message is string => message !== null);
  if (fieldMessages.length) return [...new Set(fieldMessages)].join(" ");

  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = messageFromPayload(error.response?.data);
    if (responseMessage) return responseMessage;
    if (error.response) {
      return `${fallback} (HTTP ${error.response.status}).`;
    }
    return "Unable to reach the API. Check the API URL and server CORS configuration.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
