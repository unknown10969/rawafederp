import { PageHeader } from "@/components/page-header";
import { CreateSupplierForm } from "./create-supplier-form";

export default function NewSupplierPage() {
  return (
    <>
      <PageHeader
        title="Add Supplier"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Suppliers", href: "/suppliers" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-2xl">
        <CreateSupplierForm />
      </div>
    </>
  );
}
