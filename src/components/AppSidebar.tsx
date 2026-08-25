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
  TrendingUp,
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
    to: "/sales-insights",
    labelKey: "navSalesInsights",
    descKey: "navSalesInsightsDesc",
    icon: TrendingUp,
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

function isItemActive(pathname: string, to: string) {
  return to === "/"
    ? pathname === "/"
    : pathname === to || pathname.startsWith(`${to}/`);
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { brand } = useBrand();
  const { to } = useBrandPreset();
  const { user, logout, isAdmin } = useAuth();
  const items = navItems.filter(i => !i.adminOnly || isAdmin);

  return (
    <aside
      className={`glass-sidebar hidden md:flex flex-col border-r border-white/10 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.08] ${collapsed ? "justify-center" : ""}`}
      >
        <BrandLogo className="size-8 shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white tracking-tight truncate">
              {brand.companyName}
            </div>
            <div className="text-[10px] text-burgundy-300/70 uppercase tracking-wider truncate">
              {brand.tagline}
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {items.map(item => {
          const isActive = isItemActive(location.pathname, item.to);
          const label = t(item.labelKey);
          const description = t(item.descKey);
          const linkTo = to(item.to);
          return (
            <NavLink
              key={item.to}
              to={linkTo}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] border border-white/10"
                  : "text-white/55 hover:text-white/85 hover:bg-white/[0.06] border border-transparent"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? label : undefined}
            >
              <item.icon
                className={`size-[18px] shrink-0 transition-colors ${
                  isActive
                    ? "text-burgundy-300"
                    : "text-white/40 group-hover:text-white/60"
                }`}
              />
              {!collapsed && (
                <div className="overflow-hidden">
                  <div
                    className={`font-medium truncate ${isActive ? "text-white" : ""}`}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] text-white/35 truncate">
                    {description}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-white/[0.06] pt-3 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 text-[10px] text-white/35 truncate">
            {user.username} · {roleLabel(user.role)}
          </div>
        )}
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          title={t("logout")}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-white/30 hover:text-white/50 hover:bg-white/[0.06] transition-colors"
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
    i =>
      i.to === "/sales-insights" ||
      i.to === "/backup" ||
      (i.to === "/settings" && isAdmin),
  );
  const extraActive = extra.some(item =>
    isItemActive(location.pathname, item.to),
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
    <nav
      className="md:hidden fixed z-50 left-3 right-3"
      style={{
        bottom: "calc(0.85rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="relative" ref={menuRef}>
        {moreOpen ? (
          <div
            role="menu"
            className="glass-dock absolute bottom-full left-0 right-0 mb-2 rounded-2xl p-1.5"
          >
            {extra.map(item => (
              <NavLink
                key={item.to}
                role="menuitem"
                to={to(item.to)}
                onClick={() => setMoreOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                  isItemActive(location.pathname, item.to)
                    ? "bg-white/[0.12] text-white"
                    : "text-white/85 hover:bg-white/[0.08]"
                }`}
              >
                <item.icon className="size-4 shrink-0 text-burgundy-300" />
                <span className="flex-1">
                  <span className="block font-medium">{t(item.labelKey)}</span>
                  <span className="block text-[10px] text-white/40">
                    {t(item.descKey)}
                  </span>
                </span>
              </NavLink>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMoreOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/85 hover:bg-white/[0.08]"
            >
              <LogOut className="size-4 shrink-0" />
              {t("logout")}
            </button>
          </div>
        ) : null}

        <div className="glass-dock flex items-center justify-around rounded-2xl px-1 py-1.5">
          {primary.map(item => {
            const isActive = isItemActive(location.pathname, item.to);
            const label = t(item.labelKey);
            return (
              <NavLink
                key={item.to}
                to={to(item.to)}
                className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-white/45 hover:text-white/70"
                }`}
              >
                <item.icon
                  className={`size-[18px] ${isActive ? "text-burgundy-300" : ""}`}
                />
                <span className="font-medium text-[10px]">{label}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen(open => !open)}
            className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs outline-none transition-colors ${
              extraActive || moreOpen
                ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                : "text-white/45 hover:text-white/70"
            }`}
          >
            <MoreHorizontal
              className={`size-[18px] ${extraActive || moreOpen ? "text-burgundy-300" : ""}`}
            />
            <span className="font-medium text-[10px]">{t("navMore")}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
