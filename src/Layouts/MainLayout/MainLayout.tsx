import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../Components/Layout/Navbar/Navbar";
import { NotificationCountContext } from "../../context/NotificationCountContext";
import { getUnreadNotificationCount } from "../../services/notification.services";

export default function MainLayout() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      setUnreadCount(await getUnreadNotificationCount());
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  }, []);

  useEffect(() => {
    void refreshUnreadCount();
    window.addEventListener("focus", refreshUnreadCount);

    return () => window.removeEventListener("focus", refreshUnreadCount);
  }, [refreshUnreadCount]);

  return (
    <>
      <NotificationCountContext.Provider value={{ unreadCount, refreshUnreadCount }}>
        <Navbar />
        <Outlet />
      </NotificationCountContext.Provider>
    </>
  );
}
