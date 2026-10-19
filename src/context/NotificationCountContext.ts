import { createContext } from "react";

export type NotificationCountContextType = {
  unreadCount: number | null;
  unreadCountError: string | null;
  refreshUnreadCount: () => Promise<void>;
};

export const NotificationCountContext = createContext<NotificationCountContextType | null>(null);
