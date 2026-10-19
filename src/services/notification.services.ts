import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

function readUnreadCount(payload: unknown): number | null {
  if (typeof payload === "number" && Number.isInteger(payload) && payload >= 0) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("unreadCount" in payload && typeof payload.unreadCount === "number") {
    return readUnreadCount(payload.unreadCount);
  }

  if ("count" in payload && typeof payload.count === "number") {
    return readUnreadCount(payload.count);
  }

  if ("data" in payload) {
    return readUnreadCount(payload.data);
  }

  return null;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const token = localStorage.getItem("token");
  const { data } = await axios.get<unknown>(`${baseURL}notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const count = readUnreadCount(data);

  if (count === null) {
    throw new Error("Unread notification count response did not include a count.");
  }

  return count;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = localStorage.getItem("token");

  await axios.patch(
    `${baseURL}notifications/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
