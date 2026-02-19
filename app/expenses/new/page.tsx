import { PageHeader } from "@/components/page-header";
import { CreateExpenseForm } from "./create-expense-form";

export default function NewExpensePage() {
  return (
    <>
      <PageHeader
        title="Add expense"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Expenses", href: "/expenses" },
          { label: "Add expense" },
        ]}
      />
      <div className="p-6 max-w-md">
        <CreateExpenseForm />
      </div>
    </>
  );
}
