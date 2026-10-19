import { useCallback, useContext, useEffect, useState } from "react";
import { Bell, Check, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { NotificationCountContext } from "../../context/NotificationCountContext";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "../../services/notification.services";
import { getErrorMessage } from "../../utils/errorMessage";

const PAGE_SIZE = 10;

function notificationId(item: NotificationItem): string | null {
  return item._id ?? item.id ?? null;
}

function notificationIsRead(item: NotificationItem): boolean {
  return item.isRead ?? item.read ?? false;
}

function notificationMessage(item: NotificationItem): string {
  const actor = item.sender ?? item.actor ?? item.user;
  const message = item.message ?? item.text;
  if (message) return message;
  if (actor?.name && item.type) return `${actor.name} ${item.type.replaceAll("_", " ")}.`;
  if (item.type) return item.type.replaceAll("_", " ");
  return "You have a new notification.";
}

function notificationDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function Notification() {
  const notificationContext = useContext(NotificationCountContext);
  const unreadCount = notificationContext?.unreadCount ?? null;
  const unreadCountError = notificationContext?.unreadCountError ?? null;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const result = await getNotifications({ unread: false, page: targetPage, limit: PAGE_SIZE });
      setNotifications(result.notifications);
      setPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoadError(getErrorMessage(error, "Unable to load notifications."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadNotifications(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadNotifications]);

  async function handleMarkAllAsRead() {
    if (isMarkingRead) return;

    setIsMarkingRead(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true, read: true })));
      await notificationContext?.refreshUnreadCount();
      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error(getErrorMessage(error, "Unable to mark notifications as read."));
    } finally {
      setIsMarkingRead(false);
    }
  }

  async function handleMarkAsRead(item: NotificationItem) {
    const id = notificationId(item);
    if (!id || notificationIsRead(item) || markingNotificationId) return;

    setMarkingNotificationId(id);
    try {
      await markNotificationAsRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notificationId(notification) === id
            ? { ...notification, isRead: true, read: true }
            : notification,
        ),
      );
      await notificationContext?.refreshUnreadCount();
      toast.success("Notification marked as read.");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(getErrorMessage(error, "Unable to mark this notification as read."));
    } finally {
      setMarkingNotificationId(null);
    }
  }

  const hasPreviousPage = page > 1;
  const hasNextPage = totalPages === null ? notifications.length === PAGE_SIZE : page < totalPages;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
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
              ? unreadCountError ?? "Checking unread notifications..."
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

      <section className="premium-card overflow-hidden" aria-label="Notification list">
        {isLoading ? (
          <div className="space-y-3 p-5" aria-live="polite" aria-busy="true">
            <p className="text-sm text-[color:var(--muted)]">Loading notifications…</p>
            {[0, 1, 2].map((item) => (
              <div key={item} className="skeleton h-16 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p role="alert" className="text-sm text-[color:var(--danger)]">{loadError}</p>
            <button type="button" className="secondary-button" onClick={() => void loadNotifications(page)}>
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state m-4">
            <Bell size={20} className="mx-auto mb-2 text-[color:var(--muted)]" />
            You don’t have any notifications yet.
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--line)]">
            {notifications.map((item, index) => {
              const id = notificationId(item);
              const actor = item.sender ?? item.actor ?? item.user;
              const isRead = notificationIsRead(item);

              return (
                <li
                  key={id ?? `${item.createdAt ?? "notification"}-${index}`}
                  className={`flex items-start gap-3 px-4 py-4 sm:px-5 ${isRead ? "" : "bg-[color:var(--panel)]/55"}`}
                >
                  <span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${isRead ? "bg-[color:var(--panel-strong)] text-[color:var(--muted)]" : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"}`}>
                    {actor?.photo
                      ? <img src={actor.photo} alt="" className="size-full object-cover" />
                      : <Bell size={17} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    {actor?.name && (
                      <p className="text-sm font-semibold text-[color:var(--text)]">{actor.name}</p>
                    )}
                    <p className="mt-0.5 break-words text-sm leading-5 text-[color:var(--muted)]">
                      {notificationMessage(item)}
                    </p>
                    {notificationDate(item.createdAt) && (
                      <time className="mt-1 block text-xs text-[color:var(--muted)]" dateTime={item.createdAt}>
                        {notificationDate(item.createdAt)}
                      </time>
                    )}
                  </div>
                  {!isRead && id && (
                    <button
                      type="button"
                      aria-label="Mark notification as read"
                      title="Mark as read"
                      disabled={markingNotificationId !== null}
                      onClick={() => void handleMarkAsRead(item)}
                      className="secondary-button min-h-9 shrink-0 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {markingNotificationId === id ? "Saving…" : <><Check size={15} /><span className="sr-only">Mark as read</span></>}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!isLoading && !loadError && notifications.length > 0 && (
          <div className="flex items-center justify-between border-t border-[color:var(--line)] px-4 py-3 sm:px-5">
            <span className="text-xs text-[color:var(--muted)]">
              Page {page}{totalPages !== null ? ` of ${Math.max(totalPages, 1)}` : ""}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="secondary-button min-h-9 px-3 py-2"
                disabled={!hasPreviousPage || isLoading}
                onClick={() => void loadNotifications(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="button"
                className="secondary-button min-h-9 px-3 py-2"
                disabled={!hasNextPage || isLoading}
                onClick={() => void loadNotifications(page + 1)}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
