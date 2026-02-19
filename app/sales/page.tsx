import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import { formatCurrencyQAR } from "@/lib/utils";
import { SalePDFButton } from "./sale-pdf-button";

async function getSales() {
  try {
    return await prisma.sale.findMany({
      orderBy: { soldAt: "desc" },
      take: 100,
      include: { 
        product: true,
        customer: true,
      },
    });
  } catch {
    return null;
  }
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(d);
}

export default async function SalesPage() {
  const sales = await getSales();

  return (
    <>
      <PageHeader
        title="Sales"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Sales" }]}
        addLabel="Add New"
        addHref="/sales/new"
      />
      <div className="p-6">
        {sales === null ? (
          <DbNotReady title="Sales database not initialized" />
        ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Product</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Quantity</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Unit price</th>
                <th className="text-right font-medium text-muted-foreground px-4 py-3">Total</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No sales yet. Record a sale to track revenue.
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(s.soldAt)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{s.product.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{s.quantity}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrencyQAR(s.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrencyQAR(s.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <SalePDFButton sale={s} />
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
