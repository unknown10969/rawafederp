import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import Link from "next/link";
import { deleteSupplier } from "@/app/actions/suppliers";

export const dynamic = "force-dynamic";

async function getSuppliers() {
  try {
    return await prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <>
      <PageHeader
        title="Suppliers"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Suppliers" }]}
        addLabel="Add New"
        addHref="/suppliers/new"
      />
      <div className="p-6">
        {suppliers === null ? (
          <DbNotReady title="Suppliers database not initialized" />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Contact Person</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Products Supplied</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">Purchases</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No suppliers yet. Add a supplier to track your vendors.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.contactPerson ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.email ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.productsSupplied ?? "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {s._count.purchases}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/suppliers/${s.id}/edit`}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={async () => {
                            "use server";
                            await deleteSupplier(s.id);
                          }} className="inline">
                            <button
                              type="submit"
                              className="text-sm text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
