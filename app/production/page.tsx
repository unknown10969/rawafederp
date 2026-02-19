import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { ProduceButton } from "./produce-button";
import { DbNotReady } from "@/components/db-not-ready";

async function getBOMs() {
  try {
    return await prisma.bOM.findMany({
      orderBy: { name: "asc" },
      include: {
        outputProduct: true,
        items: { include: { product: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function ProductionPage() {
  const boms = await getBOMs();

  return (
    <>
      <PageHeader
        title="Production (BOM)"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Production (BOM)" }]}
        addLabel="Add New"
        addHref="/production/new"
      />
      <div className="p-6">
        <div className="space-y-6">
          {boms === null ? (
            <DbNotReady title="Production database not initialized" />
          ) : boms.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              No recipes yet. Add a BOM to define how finished goods are made from raw materials.
            </div>
          ) : (
            boms.map((bom) => (
              <div
                key={bom.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                  <div>
                    <h2 className="font-semibold text-foreground">{bom.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Output: {bom.outputProduct.name} × {bom.outputQuantity} {bom.outputProduct.unit} per batch
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProduceButton bomId={bom.id} bomName={bom.name} />
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Ingredients (per batch)
                  </p>
                  <ul className="space-y-1">
                    {bom.items.map((item) => (
                      <li key={item.id} className="text-sm">
                        <span className="text-foreground">{item.product.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {item.quantityRequired} {item.product.unit}
                          {item.product.quantity < item.quantityRequired && (
                            <span className="text-red-400 ml-1">(low stock)</span>
                          )}
                        </span>
                      </li>
                    ))}
                    {bom.items.length === 0 && (
                      <li className="text-muted-foreground text-sm">No ingredients defined.</li>
                    )}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
