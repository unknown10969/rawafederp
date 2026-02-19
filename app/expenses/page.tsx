import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { DbNotReady } from "@/components/db-not-ready";
import { formatCurrencyQAR } from "@/lib/utils";

async function getExpenses() {
  try {
    return await prisma.expense.findMany({
      orderBy: { expenseAt: "desc" },
      take: 100,
    });
  } catch {
    return null;
  }
}


function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(d);
}

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <>
      <PageHeader
        title="Expenses"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Expenses" }]}
        addLabel="Add expense"
        addHref="/expenses/new"
      />
      <div className="p-6">
        {expenses === null ? (
          <DbNotReady title="Expenses database not initialized" />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Date</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Description</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Category</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No expenses yet. Add utilities, labor, shipping, or other costs here.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(e.expenseAt)}</td>
                      <td className="px-4 py-3 text-foreground">{e.description}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.category ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {formatCurrencyQAR(e.amount)}
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
