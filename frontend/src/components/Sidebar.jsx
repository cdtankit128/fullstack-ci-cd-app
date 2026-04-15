import { NavLink } from "react-router-dom";

export default function Sidebar({ uid, studentName, onLogout }) {
  const SIDEBAR_ITEMS = [
    { label: "Dashboard", icon: "dashboard", path: "/" },
    { label: "Tasks", icon: "assignment", path: "/tasks" },
    { label: "Analytics", icon: "leaderboard", path: "/analytics" },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0b0e14] shadow-[0_0_32px_0_rgba(186,158,255,0.08)] flex flex-col py-8 z-50">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-extrabold text-[#ba9eff] tracking-tighter font-headline">Productivity</h1>
        <p className="text-xs text-on-surface-variant font-headline font-bold tracking-tight opacity-70">Peak Performance</p>
      </div>

      <nav className="flex-1 space-y-2">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-4 py-3 text-[#ba9eff] bg-[#ba9eff]/20 rounded-r-full border-l-4 border-[#ba9eff] shadow-[0_0_16px_rgba(186,158,255,0.3)] transition-all duration-300"
                : "flex items-center gap-3 px-4 py-3 text-[#ecedf6]/60 hover:text-[#ecedf6] hover:bg-[#22262f] transition-all duration-300"
            }
          >
            <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
            <span className="font-['Manrope'] font-bold tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <button className="w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold shadow-[0_0_20px_rgba(186,158,255,0.2)] active:scale-95 transition-transform">
          New Task
        </button>

        <div className="pt-6 border-t border-outline-variant/10 flex flex-col">
          <button className="flex items-center gap-3 px-4 py-2 text-[#ecedf6]/60 hover:text-[#ecedf6] transition-colors cursor-pointer outline-none bg-transparent border-none w-full text-left">
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm font-medium">Help</span>
          </button>
          
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2 text-error-dim hover:text-error transition-colors cursor-pointer outline-none bg-transparent border-none w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
