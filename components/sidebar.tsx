"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ChefHat,
  Settings,
  Factory,
  Users,
  LogOut,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  Building2,
  UserCircle,
  ClipboardList,
  FileText,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/production", label: "Production (BOM)", icon: ChefHat },
  { href: "/work-orders", label: "Work Orders", icon: ClipboardList },
  { href: "/purchases", label: "Purchases", icon: Factory },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/suppliers", label: "Suppliers", icon: Building2 },
  { href: "/customers", label: "Customers", icon: UserCircle },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/alerts", label: "Low Stock Alerts", icon: AlertTriangle },
];

const adminNav = [
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.permissions?.includes("admin") || false;

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 border-r border-border bg-card/95 backdrop-blur flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Manufacturing ERP
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Production & Inventory</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <>
            <div className="h-px bg-border my-2" />
            {adminNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">{session?.user?.name || session?.user?.username}</div>
          {session?.user?.role && (
            <div className="text-muted-foreground">{session.user.role}</div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
