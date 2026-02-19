import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { resolveAlert } from "@/app/actions/alerts";

async function getAlerts() {
  try {
    return await prisma.lowStockAlert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
        resolvedBy: true,
      },
    });
  } catch {
    return null;
  }
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <>
      <PageHeader
        title="Low Stock Alerts"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Low Stock Alerts" }]}
      />
      <div className="p-6">
        {alerts === null ? (
          <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
            Database not initialized. Run: npx prisma db push
          </div>
        ) : alerts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">All good!</h2>
            <p className="text-muted-foreground">No low stock alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-red-500/30 bg-red-500/5 shadow-sm p-5 flex flex-wrap items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="rounded-lg bg-red-500/10 p-2 shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{alert.product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current: <span className="font-medium text-red-400">{alert.currentQty}</span> {alert.product.unit} • Threshold: {alert.threshold} {alert.product.unit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Alert created: {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>
                <form action={resolveAlert as unknown as (formData: FormData) => Promise<void>} className="shrink-0">
                  <input type="hidden" name="alertId" value={alert.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Mark resolved
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
