import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import { formatCurrencyQAR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getInventoryValuation() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    const valuation = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      quantity: p.quantity,
      averageCost: p.averageCost,
      totalValue: p.quantity * p.averageCost,
    }));

    const grandTotal = valuation.reduce((sum, p) => sum + p.totalValue, 0);

    return { valuation, grandTotal };
  } catch {
    return null;
  }
}

async function getProductProfitability() {
  try {
    // Get all finished goods
    const finishedProducts = await prisma.product.findMany({
      where: { type: "finished" },
      include: {
        sales: {
          select: {
            unitPrice: true,
            quantity: true,
            totalAmount: true,
          },
        },
        bomAsOutput: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    averageCost: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const profitability = finishedProducts
      .map((product) => {
        // Calculate average sale price
        const totalSales = product.sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalQuantity = product.sales.reduce((sum, s) => sum + s.quantity, 0);
        const avgSalePrice = totalQuantity > 0 ? totalSales / totalQuantity : 0;

        // Calculate production cost from BOM
        let productionCost = 0;
        const bom = product.bomAsOutput[0]; // Use first BOM if multiple exist
        if (bom) {
          productionCost = bom.items.reduce((sum, item) => {
            return sum + item.product.averageCost * item.quantityRequired;
          }, 0);
          // Production cost per unit of output
          if (bom.outputQuantity > 0) {
            productionCost = productionCost / bom.outputQuantity;
          }
        }

        const profitMargin = avgSalePrice - productionCost;
        const profitPercentage = avgSalePrice > 0 ? (profitMargin / avgSalePrice) * 100 : 0;

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          avgSalePrice,
          productionCost,
          profitMargin,
          profitPercentage,
        };
      })
      .filter((p) => p.avgSalePrice > 0) // Only show products with sales
      .sort((a, b) => b.profitMargin - a.profitMargin); // Sort by profit margin descending

    return profitability;
  } catch {
    return null;
  }
}

export default async function ReportsPage() {
  const inventoryData = await getInventoryValuation();
  const profitabilityData = await getProductProfitability();

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Reports" }]}
      />
      <div className="p-6 space-y-6">
        {/* Inventory Valuation */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Inventory Valuation</h2>
          {inventoryData === null ? (
            <DbNotReady title="Inventory data not available" />
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Product</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">SKU</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Quantity</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Avg Cost</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.valuation.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No products in inventory.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {inventoryData.valuation.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                            {formatCurrencyQAR(item.averageCost)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium">
                            {formatCurrencyQAR(item.totalValue)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-border bg-muted/30">
                        <td colSpan={4} className="px-4 py-3 font-semibold text-foreground">
                          Grand Total
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold text-foreground">
                          {formatCurrencyQAR(inventoryData.grandTotal)}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Profitability */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Product Profitability</h2>
          {profitabilityData === null ? (
            <DbNotReady title="Profitability data not available" />
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Product</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">SKU</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Avg Sale Price</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Production Cost</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Profit Margin</th>
                    <th className="text-right font-medium text-muted-foreground px-4 py-3">Profit %</th>
                  </tr>
                </thead>
                <tbody>
                  {profitabilityData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No sales data available for finished goods.
                      </td>
                    </tr>
                  ) : (
                    profitabilityData.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrencyQAR(item.avgSalePrice)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {formatCurrencyQAR(item.productionCost)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right tabular-nums font-medium ${
                            item.profitMargin >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {formatCurrencyQAR(item.profitMargin)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right tabular-nums font-medium ${
                            item.profitPercentage >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {item.profitPercentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
