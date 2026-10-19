import { createContext } from "react";

export type NotificationCountContextType = {
  unreadCount: number | null;
  refreshUnreadCount: () => Promise<void>;
};

export const NotificationCountContext = createContext<NotificationCountContextType | null>(null);
