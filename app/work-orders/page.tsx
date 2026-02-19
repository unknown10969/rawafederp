import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import { WorkOrderRow } from "./work-order-row";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getWorkOrders() {
  try {
    return await prisma.workOrder.findMany({
      orderBy: [
        { status: "asc" },
        { scheduledDate: "asc" },
      ],
      include: {
        bom: {
          include: {
            outputProduct: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    IN_PROGRESS: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        styles[status as keyof typeof styles] || "bg-muted text-muted-foreground"
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(d);
}

export default async function WorkOrdersPage() {
  const workOrders = await getWorkOrders();

  return (
    <>
      <PageHeader
        title="Work Orders"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Work Orders" }]}
        addLabel="Add New"
        addHref="/work-orders/new"
      />
      <div className="p-6">
        {workOrders === null ? (
          <DbNotReady title="Work Orders database not initialized" />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Recipe</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Output Product</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">Quantity</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Scheduled Date</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No work orders yet. Create a work order to plan production.
                    </td>
                  </tr>
                ) : (
                  workOrders.map((wo) => (
                    <tr key={wo.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{wo.bom.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {wo.bom.outputProduct.name} ({wo.bom.outputQuantity} {wo.bom.outputProduct.unit}/batch)
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{wo.quantityToProduce}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(wo.scheduledDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={wo.status} />
                      </td>
                      <td className="px-4 py-3">
                        <WorkOrderRow workOrder={wo} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
