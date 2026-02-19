"use client";

import { createExpense } from "@/app/actions/expenses";
import { useFormState } from "react-dom";
import Link from "next/link";

const CATEGORIES = ["utilities", "labor", "shipping", "rent", "maintenance", "other"];

export function CreateExpenseForm() {
  const [state, formAction] = useFormState(createExpense, null as { error?: string } | null);

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          placeholder="e.g. Monthly electricity bill"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1.5">
          Amount (QAR)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1.5">
          Category (optional)
        </label>
        <select
          id="category"
          name="category"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">—</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Add expense
        </button>
        <Link
          href="/expenses"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
