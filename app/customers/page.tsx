import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import Link from "next/link";
import { deleteCustomer } from "@/app/actions/customers";

export const dynamic = "force-dynamic";

async function getCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { sales: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <>
      <PageHeader
        title="Customers"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Customers" }]}
        addLabel="Add New"
        addHref="/customers/new"
      />
      <div className="p-6">
        {customers === null ? (
          <DbNotReady title="Customers database not initialized" />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Address</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">Total Orders</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No customers yet. Add a customer to track your clients.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.email ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.address ?? "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {c.totalOrders}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/customers/${c.id}/edit`}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={async () => {
                            "use server";
                            await deleteCustomer(c.id);
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
