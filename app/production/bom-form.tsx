"use client";

import { useState } from "react"; // Added missing import
import { useFormState } from 'react-dom'; // Changed to useFormState for Next 14
import { createBOM } from "@/app/actions/production";
import Link from "next/link";

type Product = { id: string; name: string; sku: string; unit: string; type: string };

export function BOMForm({ products }: { products: Product[] }) {
  const [items, setItems] = useState<{ productId: string; quantityRequired: number }[]>([]);
  
  // Changed useActionState to useFormState for Next 14 compatibility
  const [state, formAction] = useFormState(
    async (prevState: { error?: string } | null, formData: FormData) => {
      formData.set("items", JSON.stringify(items));
      return createBOM(formData);
    },
    null as { error?: string } | null
  );

  function addItem() {
    const firstRaw = products.find((p) => p.type === "raw") ?? products[0];
    setItems((prev) => [...prev, { productId: firstRaw?.id ?? "", quantityRequired: 1 }]);
  }

  function updateItem(index: number, field: "productId" | "quantityRequired", value: string | number) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field] : value } as { productId: string; quantityRequired: number };
      return next;
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const finishedProducts = products.filter((p) => p.type === "finished");
  const rawProducts = products.filter((p) => p.type === "raw");

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Recipe name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          placeholder="e.g. Widget Assembly"
        />
      </div>

      <div>
        <label htmlFor="outputProductId" className="block text-sm font-medium text-foreground mb-1.5">
          Output (finished good)
        </label>
        <select
          id="outputProductId"
          name="outputProductId"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select product</option>
          {(finishedProducts.length > 0 ? finishedProducts : products).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="outputQuantity" className="block text-sm font-medium text-foreground mb-1.5">
          Output quantity per batch
        </label>
        <input
          id="outputQuantity"
          name="outputQuantity"
          type="number"
          min="0.001"
          step="1"
          defaultValue="1"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-foreground">Ingredients (raw materials per batch)</label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-primary hover:underline"
          >
            + Add ingredient
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                value={item.productId}
                onChange={(e) => updateItem(i, "productId", e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select material</option>
                {(rawProducts.length > 0 ? rawProducts : products).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0.001"
                step="any"
                value={item.quantityRequired}
                onChange={(e) => updateItem(i, "quantityRequired", parseFloat(e.target.value) || 0)}
                className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground text-right focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-muted-foreground hover:text-red-500 font-bold px-2"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create recipe
        </button>
        <Link
          href="/production"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}