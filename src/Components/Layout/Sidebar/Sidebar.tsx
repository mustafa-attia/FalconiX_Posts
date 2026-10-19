import { Bookmark, Home, UserRound, LockKeyhole } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { id: "feed", label: "Feed", path: "/", icon: Home },
  { id: "profile", label: "Profile", path: "/profile", icon: UserRound },
  { id: "saved", label: "Saved", path: "/saved", icon: Bookmark },
  { id: "settings", label: "Change Password", path: "/settings", icon: LockKeyhole },
];

export default function Sidebar() {
  return (
    <aside className="premium-card w-full p-3 lg:sticky lg:top-24 lg:w-72 xl:w-80">
      <div className="mb-4 px-2 pt-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#788984]">Navigation</p>
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <li key={link.id} className="shrink-0 lg:w-full">
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 sm:gap-3 sm:px-4 ${
                    isActive ? "bg-[#e5f1ed] text-[#204a43] shadow-[inset_0_0_0_1px_rgba(40,122,107,0.16)]" : "text-[#647773] hover:bg-[color:var(--panel)] hover:text-[color:var(--primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={isActive ? "shrink-0 text-[#287a6b]" : "shrink-0 text-[#82938e]"}
                    />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
