import { Dropdown, Label } from "@heroui/react";
import { Bell, ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext, type UserContextType } from "../../../context/UserContext";
import { NotificationCountContext } from "../../../context/NotificationCountContext";
import { AuthContext } from "../../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { label: "Feed", path: "/", icon: Home },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Notification", path: "/notification", icon: Bell },
  ];

  const userContext = useContext(UserContext) as UserContextType | null;
  const userDetails = userContext?.userDetails ?? null;
  const notificationContext = useContext(NotificationCountContext);
  const unreadCount = notificationContext?.unreadCount ?? null;
  const { updateToken } = useContext(AuthContext);

  function logout() {
    updateToken(null);
    navigate("/auth/login");
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[color:var(--line)] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="shrink-0">
          <div className="flex items-center gap-3">
            <span className="brand-mark">Falconix</span>
            <span className="text-lg font-black tracking-[-0.06em] text-[color:var(--text)]">Posts</span>
          </div>
        </NavLink>

        <div className="hidden items-center gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? "active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} strokeWidth={isActive ? 2 : 1.8} />
                    {item.label}
                    {item.label === "Notification" && unreadCount !== null && unreadCount > 0 && (
                      <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${isActive ? "bg-[#287a6b] text-white" : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"}`}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        <Dropdown>
          <Dropdown.Trigger>
            <div className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-2.5 text-[color:var(--text)] transition-colors hover:border-[rgba(40,122,107,0.25)] hover:bg-[color:var(--panel)]">
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-[color:var(--accent-soft)] text-[10px] font-semibold uppercase text-[color:var(--primary)]">
                {userDetails?.photo ? (
                  <img src={userDetails.photo} alt={userDetails.name ?? "User avatar"} className="h-full w-full object-cover" />
                ) : (
                  <span>{(userDetails?.username ?? "U").slice(0, 1)}</span>
                )}
              </div>
              <span className="hidden text-sm font-semibold sm:block">{userDetails?.name ?? "Profile"}</span>
              <ChevronDown size={15} className="text-[color:var(--muted)]" />
            </div>
          </Dropdown.Trigger>

          <Dropdown.Popover className="min-w-52">
            <Dropdown.Menu
              onAction={(key) => {
                if (key === "profile") navigate("/profile");
                if (key === "settings") navigate("/settings");
                if (key === "logout") logout();
              }}
            >
              <Dropdown.Item id="profile" textValue="Profile">
                <User size={16} />
                <Label>Profile</Label>
              </Dropdown.Item>

              <Dropdown.Item id="settings" textValue="Settings">
                <Settings size={16} />
                <Label>Settings</Label>
              </Dropdown.Item>

              <Dropdown.Item id="logout" textValue="Logout" variant="danger" onClick={logout}>
                <LogOut size={16} />
                <Label>Logout</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </nav>
  );
}
