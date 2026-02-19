"use client";

import { createCustomer } from "@/app/actions/customers";
import { useFormState } from "react-dom";
import Link from "next/link";

export function CreateCustomerForm() {
  const [state, formAction] = useFormState(createCustomer, null as { error?: string } | null);

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Customer Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          placeholder="e.g. XYZ Trading LLC"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            placeholder="+974 XXXX XXXX"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            placeholder="customer@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1.5">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          placeholder="Full address"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Customer
        </button>
        <Link
          href="/customers"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
