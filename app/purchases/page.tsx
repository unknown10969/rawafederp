import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import { formatCurrencyQAR } from "@/lib/utils";
import { PurchasePDFButton } from "./purchase-pdf-button";

async function getPurchases() {
  try {
    return await prisma.purchase.findMany({
      orderBy: { purchasedAt: "desc" },
      take: 100,
      include: { 
        product: true,
        supplier: true,
      },
    });
  } catch {
    return null;
  }
}


function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(d);
}

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  return (
    <>
      <PageHeader
        title="Purchases"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Purchases" }]}
        addLabel="Add New"
        addHref="/purchases/new"
      />
      <div className="p-6">
        {purchases === null ? (
          <DbNotReady title="Purchases database not initialized" />
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
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No purchases yet. Log a purchase to update inventory and average cost.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.purchasedAt)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.product.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.quantity}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrencyQAR(p.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrencyQAR(p.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <PurchasePDFButton purchase={p} />
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
