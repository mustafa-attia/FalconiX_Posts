import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export type NotificationItem = {
  _id?: string;
  id?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  message?: string;
  text?: string;
  type?: string;
  sender?: { name?: string; username?: string; photo?: string };
  actor?: { name?: string; username?: string; photo?: string };
  user?: { name?: string; username?: string; photo?: string };
  post?: string | { _id?: string; id?: string };
};

export type NotificationsPage = {
  notifications: NotificationItem[];
  currentPage: number;
  totalPages: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function findNotifications(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return null;

  if (Array.isArray(payload.notifications)) return payload.notifications;
  if (Array.isArray(payload.data)) return payload.data;
  if (isRecord(payload.data)) return findNotifications(payload.data);
  return null;
}

function readPageNumber(payload: unknown, requestedPage: number): number {
  if (!isRecord(payload)) return requestedPage;

  for (const key of ["currentPage", "page"]) {
    const value = payload[key];
    if (typeof value === "number" && Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  if (isRecord(payload.paginationResult)) {
    return readPageNumber(payload.paginationResult, requestedPage);
  }

  if (isRecord(payload.data)) {
    return readPageNumber(payload.data, requestedPage);
  }

  return requestedPage;
}

function readTotalPages(payload: unknown): number | null {
  if (!isRecord(payload)) return null;

  for (const key of ["totalPages", "numberOfPages"]) {
    const value = payload[key];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
      return value;
    }
  }

  if (isRecord(payload.paginationResult)) {
    return readTotalPages(payload.paginationResult);
  }

  if (isRecord(payload.data)) {
    return readTotalPages(payload.data);
  }

  return null;
}

export async function getNotifications({
  unread = false,
  page = 1,
  limit = 10,
}: {
  unread?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<NotificationsPage> {
  const token = localStorage.getItem("token");
  const { data } = await axios.get<unknown>(`${baseURL}notifications`, {
    params: { unread, page, limit },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const notifications = findNotifications(data);

  if (!notifications) {
    throw new Error("Notifications response did not include a notification list.");
  }

  return {
    notifications: notifications.filter(isRecord) as NotificationItem[],
    currentPage: readPageNumber(data, page),
    totalPages: readTotalPages(data),
  };
}

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

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const normalizedId = notificationId.trim();
  if (!normalizedId) {
    throw new Error("A notification ID is required.");
  }

  const token = localStorage.getItem("token");
  await axios.patch(
    `${baseURL}notifications/${encodeURIComponent(normalizedId)}/read`,
    undefined,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = localStorage.getItem("token");

  await axios.patch(
    `${baseURL}notifications/read-all`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
