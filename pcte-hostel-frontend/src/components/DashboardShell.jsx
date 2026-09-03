import { useState } from "react";
import { LogOut, Menu, X, ChevronRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import pcteLogo from "../assets/pcte-logo.svg";

export default function DashboardShell({ navItems, activeKey, onNavigate, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() { logout(); navigate("/login"); }
  function handleNavClick(key) { onNavigate(key); setMobileOpen(false); }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-sidebar flex flex-col z-50 transition-transform duration-250 ease-out shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-sidebarBorder">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
              <img src={pcteLogo} alt="PCTE" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="text-white text-sm font-semibold tracking-tight group-hover:text-white/80 transition-colors">
                PCTE Residence
              </span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-white/40 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`relative w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-[13px] transition-all duration-100 ${
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  {isActive && <span className="nav-active-bar" />}
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={13} className="text-white/30 shrink-0" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User + Sign Out */}
        <div className="p-3 border-t border-sidebarBorder space-y-1">
          <div className="px-3 py-2.5 rounded-md flex items-center gap-2.5 bg-white/5">
            <div className="w-8 h-8 rounded-md bg-brand/80 flex items-center justify-center shrink-0">
              <span className="text-white/80 text-[11px] font-semibold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[13px] font-medium truncate leading-tight">{user?.name}</p>
              <p className="text-white/35 text-[11px] font-mono truncate">{user?.collegeId || "admin"}</p>
            </div>
          </div>
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/35 hover:text-white/60 rounded-md hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={13} /> Back to site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/35 hover:text-red-400 rounded-md hover:bg-white/5 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-line px-5 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-muted hover:text-ink hover:bg-paper rounded-md"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] text-subtle uppercase tracking-widest font-medium hidden sm:block">
                PCTE Hostel Management
              </p>
              <h1 className="text-base font-semibold text-ink leading-tight">
                {navItems.find(n => n.key === activeKey)?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[13px] text-muted">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-sidebar flex items-center justify-center">
              <span className="text-white text-[11px] font-semibold">{initials}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-5 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
