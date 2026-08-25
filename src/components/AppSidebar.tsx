import {
  Archive,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Network,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { roleLabel, t } from "@/config/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/contexts/BrandContext";
import { useBrandPreset } from "@/contexts/BrandPresetContext";

const navItems = [
  {
    to: "/",
    labelKey: "navDashboard",
    descKey: "navDashboardDesc",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    to: "/networks",
    labelKey: "navNetworks",
    descKey: "navNetworksDesc",
    icon: Network,
    adminOnly: false,
  },
  {
    to: "/contracts",
    labelKey: "navContracts",
    descKey: "navContractsDesc",
    icon: FileText,
    adminOnly: false,
  },
  {
    to: "/scorecard",
    labelKey: "navScorecard",
    descKey: "navScorecardDesc",
    icon: ClipboardCheck,
    adminOnly: false,
  },
  {
    to: "/backup",
    labelKey: "navArchive",
    descKey: "navArchiveDesc",
    icon: Archive,
    adminOnly: false,
  },
  {
    to: "/settings",
    labelKey: "navSettings",
    descKey: "navSettingsDesc",
    icon: Settings,
    adminOnly: true,
  },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { brand } = useBrand();
  const { to } = useBrandPreset();
  const { user, logout, isAdmin } = useAuth();
  const items = navItems.filter(i => !i.adminOnly || isAdmin);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-burgundy-800/30 bg-gradient-to-b from-burgundy-950/50 via-sidebar to-sidebar transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-burgundy-800/20 ${collapsed ? "justify-center" : ""}`}
      >
        <BrandLogo className="size-8 shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white tracking-tight truncate">
              {brand.companyName}
            </div>
            <div className="text-xs text-burgundy-300/60 uppercase tracking-wider truncate">
              {brand.tagline}
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {items.map(item => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to ||
                location.pathname.startsWith(`${item.to}/`);
          const label = t(item.labelKey);
          const description = t(item.descKey);
          const linkTo = to(item.to);
          return (
            <NavLink
              key={item.to}
              to={linkTo}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white/8 text-white shadow-sm border-l-2 border-burgundy-400 pl-[10px]"
                  : "text-white/50 hover:text-white/80 hover:bg-burgundy-900/20 border-l-2 border-transparent pl-[10px]"
              } ${collapsed ? "justify-center px-2 border-l-0 pl-2" : ""}`}
              title={collapsed ? label : undefined}
            >
              <item.icon
                className={`size-[18px] shrink-0 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/35 group-hover:text-white/55"
                }`}
              />
              {!collapsed && (
                <div className="overflow-hidden">
                  <div
                    className={`font-medium truncate text-sm ${isActive ? "text-white" : ""}`}
                  >
                    {label}
                  </div>
                  <div
                    className={`text-xs truncate transition-colors ${
                      isActive ? "text-white/45" : "text-white/25"
                    }`}
                  >
                    {description}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-burgundy-800/15 pt-3 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 text-[10px] text-white/35 truncate">
            {user.username} · {roleLabel(user.role)}
          </div>
        )}
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-white/40 hover:text-white/70 hover:bg-burgundy-900/15 transition-colors"
          title={t("logout")}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-white/30 hover:text-white/50 hover:bg-burgundy-900/15 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span>{t("collapse")}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const { to } = useBrandPreset();
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const primary = navItems.filter(i => !i.adminOnly).slice(0, 4);
  const extra = navItems.filter(
    i => i.to === "/backup" || (i.to === "/settings" && isAdmin),
  );
  const extraActive = extra.some(item =>
    item.to === "/"
      ? location.pathname === "/"
      : location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`),
  );

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-burgundy-800/35 bg-sidebar/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-1.5">
        {primary.map(item => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to ||
                location.pathname.startsWith(`${item.to}/`);
          const label = t(item.labelKey);
          return (
            <NavLink
              key={item.to}
              to={to(item.to)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs min-w-[56px] transition-colors ${
                isActive
                  ? "text-white bg-white/8"
                  : "text-white/35 hover:text-white/55"
              }`}
            >
              <item.icon
                className={`size-[18px] ${isActive ? "text-burgundy-400" : ""}`}
              />
              <span className="font-medium text-[10px]">{label}</span>
            </NavLink>
          );
        })}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen(open => !open)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs min-w-[56px] transition-colors outline-none ${
              extraActive || moreOpen
                ? "text-white bg-white/8"
                : "text-white/35 hover:text-white/55"
            }`}
          >
            <MoreHorizontal
              className={`size-[18px] ${extraActive || moreOpen ? "text-burgundy-400" : ""}`}
            />
            <span className="font-medium text-[10px]">{t("navMore")}</span>
          </button>
          {moreOpen ? (
            <div
              role="menu"
              className="absolute bottom-full right-0 mb-2 z-[60] min-w-[11.5rem] rounded-lg border border-burgundy-800/40 bg-sidebar p-1 shadow-xl"
            >
              {extra.map(item => (
                <NavLink
                  key={item.to}
                  role="menuitem"
                  to={to(item.to)}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/8"
                >
                  <item.icon className="size-4 shrink-0" />
                  {t(item.labelKey)}
                </NavLink>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMoreOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/8"
              >
                <LogOut className="size-4 shrink-0" />
                {t("logout")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
