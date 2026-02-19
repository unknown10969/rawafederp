import { PageHeader } from "@/components/page-header";
import { CreateCustomerForm } from "./create-customer-form";

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        title="Add Customer"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Customers", href: "/customers" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-2xl">
        <CreateCustomerForm />
      </div>
    </>
  );
}
