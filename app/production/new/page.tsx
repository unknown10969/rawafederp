import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { BOMForm } from "../bom-form";

export default async function NewBOMPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Add Recipe (BOM)"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Production (BOM)", href: "/production" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-2xl">
        <BOMForm products={products} />
      </div>
    </>
  );
}
