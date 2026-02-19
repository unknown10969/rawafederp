import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, LucideIcon, Plus, Package, ShoppingCart, Factory } from "lucide-react";
import Link from "next/link";
import { formatCurrencyQAR } from "@/lib/utils";

async function getDashboardMetrics() {
  try {
    const [revenueResult, purchaseExpenseResult, otherExpenseResult, alertCount] = await Promise.all([
      prisma.sale.aggregate({ _sum: { totalAmount: true } }),
      prisma.purchase.aggregate({ _sum: { totalAmount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.lowStockAlert.count({ where: { isResolved: false } }),
    ]);

    const revenue = Number(revenueResult._sum.totalAmount ?? 0);
    const purchaseCosts = Number(purchaseExpenseResult._sum.totalAmount ?? 0);
    const otherExpenses = Number(otherExpenseResult._sum.amount ?? 0);
    const expenses = purchaseCosts + otherExpenses;
    const profit = revenue - expenses;

    return { revenue, expenses, profit, alertCount };
  } catch {
    return { revenue: 0, expenses: 0, profit: 0, alertCount: 0 };
  }
}

function MetricCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "positive" | "negative";
}) {
  const variantStyles = {
    default: "border-border bg-card text-card-foreground",
    positive: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    negative: "border-red-500/30 bg-red-500/5 text-red-400",
  };

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}


export default async function DashboardPage() {
  const { revenue, expenses, profit, alertCount } = await getDashboardMetrics();

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Dashboard" }]}
      />
      <div className="p-6">
        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Revenue"
            value={formatCurrencyQAR(revenue)}
            icon={DollarSign}
            variant="default"
          />
          <MetricCard
            title="Expenses"
            value={formatCurrencyQAR(expenses)}
            icon={TrendingDown}
            variant="negative"
          />
          <MetricCard
            title="Profit"
            value={formatCurrencyQAR(profit)}
            icon={TrendingUp}
            variant={profit >= 0 ? "positive" : "negative"}
          />
          <Link href="/alerts">
            <MetricCard
              title="Low Stock Alerts"
              value={alertCount.toString()}
              icon={AlertTriangle}
              variant={alertCount > 0 ? "negative" : "default"}
            />
          </Link>
        </div>
        {/* Quick actions */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sales/new"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              New sale
            </Link>
            <Link
              href="/purchases/new"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Factory className="h-4 w-4" />
              New purchase
            </Link>
            <Link
              href="/inventory/new"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Package className="h-4 w-4" />
              New product
            </Link>
            <Link
              href="/production/new"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              New recipe
            </Link>
          </div>
        </div>

        {/* Summary card */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground">Summary</h2>
          <p className="mt-2 text-muted-foreground">
            Revenue from sales, expenses from purchases and other costs. Profit = Revenue − Expenses.
            {alertCount > 0 && (
              <span className="block mt-2 text-red-400">
                ⚠️ {alertCount} low stock alert{alertCount > 1 ? "s" : ""} require attention.
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
