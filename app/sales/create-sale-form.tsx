"use client";

import { createSale } from "@/app/actions/sales";
import { useFormState } from "react-dom";
import Link from "next/link";

type Product = { id: string; name: string; sku: string };
type Customer = { id: string; name: string };

export function CreateSaleForm({ products, customers }: { products: Product[]; customers: Customer[] }) {
  const [state, formAction] = useFormState(createSale, null as { error?: string } | null);

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-foreground mb-1.5">
          Customer (optional)
        </label>
        <select
          id="customerId"
          name="customerId"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-foreground mb-1.5">
          Product
        </label>
        <select
          id="productId"
          name="productId"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-1.5">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0.001"
          step="any"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="unitPrice" className="block text-sm font-medium text-foreground mb-1.5">
          Unit price (selling price per unit)
        </label>
        <input
          id="unitPrice"
          name="unitPrice"
          type="number"
          min="0"
          step="0.01"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Record sale
        </button>
        <Link
          href="/sales"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
