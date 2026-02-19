import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { CreatePurchaseForm } from "../create-purchase-form";

export const dynamic = "force-dynamic";

export default async function NewPurchasePage() {
  const [products, suppliers] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
    prisma.supplier.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
  ]);

  return (
    <>
      <PageHeader
        title="Log Purchase"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Purchases", href: "/purchases" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-lg">
        <CreatePurchaseForm products={products} suppliers={suppliers} />
      </div>
    </>
  );
}
