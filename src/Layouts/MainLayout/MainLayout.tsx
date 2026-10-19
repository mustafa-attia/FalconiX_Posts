import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../Components/Layout/Navbar/Navbar";
import { NotificationCountContext } from "../../context/NotificationCountContext";
import { AuthContext } from "../../context/AuthContext";
import { getUnreadNotificationCount } from "../../services/notification.services";
import { getErrorMessage } from "../../utils/errorMessage";

export default function MainLayout() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [unreadCountError, setUnreadCountError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);

  const refreshUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(null);
      setUnreadCountError(null);
      return;
    }

    setUnreadCount(null);
    setUnreadCountError(null);
    try {
      setUnreadCount(await getUnreadNotificationCount());
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      setUnreadCountError(
        getErrorMessage(error, "Could not load unread notification count. Try again later."),
      );
    }
  }, [token]);

  useEffect(() => {
    void refreshUnreadCount();
    window.addEventListener("focus", refreshUnreadCount);

    return () => window.removeEventListener("focus", refreshUnreadCount);
  }, [refreshUnreadCount]);

  return (
    <>
      <NotificationCountContext.Provider value={{ unreadCount, unreadCountError, refreshUnreadCount }}>
        <Navbar />
        <Outlet />
      </NotificationCountContext.Provider>
    </>
  );
}
