"use client";

import { createUser } from "@/app/actions/users";
import { useFormState } from "react-dom";
import Link from "next/link";

type Role = { id: string; name: string; description: string | null };

export function CreateUserForm({ roles }: { roles: Role[] }) {
  const [state, formAction] = useFormState(createUser, null as { error?: string } | null);

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-6 space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1.5">
          Username *
        </label>
        <input
          id="username"
          name="username"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="roleId" className="block text-sm font-medium text-foreground mb-1.5">
          Role
        </label>
        <select
          id="roleId"
          name="roleId"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">No role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} {r.description && `- ${r.description}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked
            className="rounded border-border"
          />
          <span className="text-sm text-foreground">Active</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create User
        </button>
        <Link
          href="/users"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
