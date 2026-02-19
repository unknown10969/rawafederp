"use client";

import { createWorkOrder } from "@/app/actions/work-orders";
import { useFormState } from "react-dom";
import Link from "next/link";

type BOM = {
  id: string;
  name: string;
  outputProduct: {
    name: string;
    unit: string;
  };
  outputQuantity: number;
};

export function CreateWorkOrderForm({ boms }: { boms: BOM[] }) {
  const [state, formAction] = useFormState(createWorkOrder, null as { error?: string } | null);

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="recipeId" className="block text-sm font-medium text-foreground mb-1.5">
          Recipe (BOM) <span className="text-red-400">*</span>
        </label>
        <select
          id="recipeId"
          name="recipeId"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select recipe</option>
          {boms.map((bom) => (
            <option key={bom.id} value={bom.id}>
              {bom.name} → {bom.outputProduct.name} ({bom.outputQuantity} {bom.outputProduct.unit}/batch)
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantityToProduce" className="block text-sm font-medium text-foreground mb-1.5">
          Quantity to Produce (batches) <span className="text-red-400">*</span>
        </label>
        <input
          id="quantityToProduce"
          name="quantityToProduce"
          type="number"
          min="1"
          step="1"
          defaultValue="1"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-foreground mb-1.5">
          Scheduled Date <span className="text-red-400">*</span>
        </label>
        <input
          id="scheduledDate"
          name="scheduledDate"
          type="datetime-local"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Work Order
        </button>
        <Link
          href="/work-orders"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
