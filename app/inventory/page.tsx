import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { InventorySearch } from "./inventory-search";
import { cn, formatCurrencyQAR } from "@/lib/utils";
import { DbNotReady } from "@/components/db-not-ready";

async function getProducts(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
        ],
      }
    : {};
  try {
    return await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
    });
  } catch {
    return null;
  }
}

function StatusBadge({ quantity, threshold }: { quantity: number; threshold: number }) {
  const isLow = threshold > 0 && quantity < threshold;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isLow
          ? "bg-red-500/15 text-red-400 border border-red-500/30"
          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      )}
    >
      {isLow ? "Low Stock" : "Good"}
    </span>
  );
}


export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const products = await getProducts(search);

  return (
    <>
      <PageHeader
        title="Inventory"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Inventory" }]}
        addLabel="Add New"
        addHref="/inventory/new"
      />
      <div className="p-6">
        <InventorySearch defaultValue={search} />
        {products === null ? (
          <DbNotReady title="Inventory database not initialized" />
        ) : (
        <div className="mt-4 rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">SKU</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Type</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Quantity</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Unit</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Avg Cost</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{p.type}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.quantity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.unit}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrencyQAR(p.averageCost)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge quantity={p.quantity} threshold={p.lowStockThreshold} />
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
