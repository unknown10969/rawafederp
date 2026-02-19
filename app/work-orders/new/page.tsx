import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { CreateWorkOrderForm } from "./create-work-order-form";

export const dynamic = "force-dynamic";

async function getBOMs() {
  try {
    return await prisma.bOM.findMany({
      orderBy: { name: "asc" },
      include: {
        outputProduct: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function NewWorkOrderPage() {
  const boms = await getBOMs();

  return (
    <>
      <PageHeader
        title="Add Work Order"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Work Orders", href: "/work-orders" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-2xl">
        <CreateWorkOrderForm boms={boms} />
      </div>
    </>
  );
}
