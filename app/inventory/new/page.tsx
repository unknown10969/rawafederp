import { PageHeader } from "@/components/page-header";
import { createProduct } from "@/app/actions/inventory";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="Add Product"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Inventory", href: "/inventory" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-lg">
        <form action={createProduct as unknown as (formData: FormData) => Promise<void>} className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Steel Rod"
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-foreground mb-1.5">
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. RAW-001"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1.5">
              Type
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="raw">Raw material</option>
              <option value="finished">Finished good</option>
            </select>
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-foreground mb-1.5">
              Unit
            </label>
            <input
              id="unit"
              name="unit"
              defaultValue="pcs"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="pcs, kg, L..."
            />
          </div>
          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-foreground mb-1.5">
              Low stock threshold
            </label>
            <input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              step="1"
              defaultValue="0"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Below this quantity = Low Stock (red badge)</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create product
            </button>
            <Link
              href="/inventory"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
