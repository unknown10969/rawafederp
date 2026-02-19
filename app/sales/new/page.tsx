import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { CreateSaleForm } from "../create-sale-form";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const [products, customers] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
  ]);

  return (
    <>
      <PageHeader
        title="Record Sale"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Sales", href: "/sales" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-lg">
        <CreateSaleForm products={products} customers={customers} />
      </div>
    </>
  );
}
