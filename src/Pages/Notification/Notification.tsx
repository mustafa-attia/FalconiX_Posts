
import { useContext, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { NotificationCountContext } from "../../context/NotificationCountContext";
import { markAllNotificationsAsRead } from "../../services/notification.services";

export default function Notification() {
  const notificationContext = useContext(NotificationCountContext);
  const unreadCount = notificationContext?.unreadCount ?? null;
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  async function handleMarkAllAsRead() {
    if (isMarkingRead) return;

    setIsMarkingRead(true);

    try {
      await markAllNotificationsAsRead();
      await notificationContext?.refreshUnreadCount();
      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Unable to mark notifications as read.");
    } finally {
      setIsMarkingRead(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="premium-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <Bell size={19} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">Updates</p>
            <h1 className="mt-1 text-xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Notifications</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-[color:var(--muted)]" aria-live="polite">
            {unreadCount === null
              ? "Checking unread notifications..."
              : unreadCount === 0
                ? "You’re all caught up."
                : `${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`}
          </p>
          {unreadCount !== null && unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingRead}
              className="secondary-button min-h-10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck size={16} />
              {isMarkingRead ? "Marking read..." : "Mark all as read"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
