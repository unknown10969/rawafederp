"use client";

import Link from "next/link";

export function DbNotReady({ title = "Database not initialized" }: { title?: string }) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your SQLite file exists but the tables haven’t been created yet. Run:
      </p>
      <pre className="mt-3 overflow-auto rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
        cd C:\Users\user\manufacturing-erp{"\n"}npx prisma generate{"\n"}npx prisma db push
      </pre>
      <div className="mt-4 flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

