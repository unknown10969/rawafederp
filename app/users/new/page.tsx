import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { CreateUserForm } from "../create-user-form";

export default async function NewUserPage() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Add User"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Users", href: "/users" },
          { label: "Add New" },
        ]}
      />
      <div className="p-6 max-w-lg">
        <CreateUserForm roles={roles} />
      </div>
    </>
  );
}
