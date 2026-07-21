"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type ChildItem = { href: string; icon: React.ElementType; label: string };
export type ParentItem = { label: string; icon: React.ElementType; children: ChildItem[] };
export type MenuItem = ChildItem | ParentItem;

function isParent(item: MenuItem): item is ParentItem {
  return "children" in item;
}

export type AppSidebarProps = {
  menuItems: MenuItem[];
  brandLabel: string;
  homeHref: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onCollapseToggle?: () => void;
};

export default function AppSidebar({
  menuItems,
  brandLabel,
  homeHref,
  collapsed,
  mobileOpen,
  onMobileClose,
  onCollapseToggle,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden flex-col bg-[#0c1d4a] text-white transition-all duration-200 ease-in-out md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarHeader homeHref={homeHref} brandLabel={brandLabel} collapsed={collapsed} />
        <SidebarNav menuItems={menuItems} pathname={pathname} collapsed={collapsed} />
        {onCollapseToggle && (
          <div className="border-t border-gray-700/50 p-2">
            <button
              onClick={onCollapseToggle}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white",
                collapsed ? "justify-center" : "gap-3"
              )}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              {!collapsed && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        )}
      </aside>

      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0c1d4a] text-white shadow-2xl transition-all duration-200 ease-in-out",
              collapsed ? "w-16" : "w-64"
            )}
            role="dialog"
            aria-modal="true"
          >
            <MobileSidebarHeader
              homeHref={homeHref}
              brandLabel={brandLabel}
              collapsed={collapsed}
              onMobileClose={onMobileClose}
              onCollapseToggle={onCollapseToggle}
            />
            <SidebarNav
              menuItems={menuItems}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onMobileClose}
            />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarHeader({
  homeHref,
  brandLabel,
  collapsed,
}: {
  homeHref: string;
  brandLabel: string;
  collapsed: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border-b border-gray-700/50",
        collapsed ? "p-2" : "p-4"
      )}
    >
      <Link
        href={homeHref}
        className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}
      >
        <img
          src="/logo.jpeg"
          alt="Musa Travel Service"
          className="h-10 w-auto rounded bg-white object-contain p-0.5"
        />
        {!collapsed && (
          <div>
            <div className="text-sm font-bold leading-tight">Musa Travel Service</div>
            <div className="text-[10px] text-gray-400">{brandLabel}</div>
          </div>
        )}
      </Link>
    </div>
  );
}

function MobileSidebarHeader({
  homeHref,
  brandLabel,
  collapsed,
  onMobileClose,
  onCollapseToggle,
}: {
  homeHref: string;
  brandLabel: string;
  collapsed: boolean;
  onMobileClose: () => void;
  onCollapseToggle?: () => void;
}) {
  return (
    <div
      className={cn(
        "border-b border-gray-700/50",
        collapsed ? "flex flex-col items-center gap-2 px-1 py-2" : "flex items-center justify-between px-3 py-3"
      )}
    >
      <Link
        href={homeHref}
        className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}
      >
        <img
          src="/logo.jpeg"
          alt="Musa Travel Service"
          className="h-9 w-auto rounded bg-white object-contain p-0.5"
        />
        {!collapsed && (
          <div>
            <div className="text-sm font-bold leading-tight">Musa Travel</div>
            <div className="text-[10px] text-gray-400">{brandLabel}</div>
          </div>
        )}
      </Link>
      <div className={cn("flex", collapsed ? "flex-col gap-1" : "items-center gap-1")}>
        {onCollapseToggle && (
          <button
            onClick={onCollapseToggle}
            className="rounded p-1.5 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
        <button
          onClick={onMobileClose}
          className="rounded p-1.5 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          title="Close menu"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function SidebarNav({
  menuItems,
  pathname,
  collapsed,
  onNavigate,
}: {
  menuItems: MenuItem[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex-1 overflow-y-auto py-3">
      <nav className={cn("space-y-0.5", collapsed ? "px-1" : "px-2")}>
        {menuItems.map((item) => {
          if (isParent(item)) {
            const isActive = item.children.some((c) => pathname.startsWith(c.href));
            const isOpen = openMenus[item.label] || isActive;
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "group flex w-full items-center rounded-md text-sm transition-colors",
                    collapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-2",
                    isActive
                      ? "bg-[#dc2626] text-white"
                      : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={cn("flex items-center", collapsed ? "gap-0" : "gap-3")}>
                    {collapsed ? (
                      <CollapsedTooltip label={item.label}>
                        <item.icon size={20} />
                      </CollapsedTooltip>
                    ) : (
                      <item.icon size={18} />
                    )}
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                  {!collapsed && (
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                    />
                  )}
                </button>
                {isOpen && (
                  <div className={cn("mt-1 space-y-0.5", collapsed ? "ml-0" : "ml-4")}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "group flex items-center rounded-md transition-colors",
                          collapsed
                            ? "justify-center px-2 py-1.5 text-xs"
                            : "gap-3 px-3 py-2 text-sm",
                          pathname === child.href
                            ? "bg-[#dc2626]/10 text-[#dc2626]"
                            : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                        )}
                        title={collapsed ? child.label : undefined}
                      >
                        {collapsed ? (
                          <CollapsedTooltip label={child.label}>
                            <child.icon size={16} />
                          </CollapsedTooltip>
                        ) : (
                          <child.icon size={16} />
                        )}
                        {!collapsed && <span>{child.label}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center rounded-md text-sm transition-colors",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                pathname === item.href
                  ? "bg-[#dc2626] text-white"
                  : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              {collapsed ? (
                <CollapsedTooltip label={item.label}>
                  <item.icon size={20} />
                </CollapsedTooltip>
              ) : (
                <item.icon size={18} />
              )}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function CollapsedTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/tooltip relative flex items-center justify-center">
      {children}
      <span className="pointer-events-none absolute left-full ml-2 z-[60] rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
