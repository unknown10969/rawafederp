import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { DbNotReady } from "@/components/db-not-ready";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { role: true },
    });
  } catch {
    return null;
  }
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(d);
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <>
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Users" },
        ]}
        addLabel="Add New User"
        addHref="/users/new"
      />
      <div className="p-6">
        {users === null ? (
          <DbNotReady title="Users database not initialized" />
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Username</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Full Name</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Role</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Created</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No users found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{user.username}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.fullName || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.role?.name || "No role"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.isActive
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/users/${user.id}/edit`}
                          className="text-primary hover:underline text-sm"
                        >
                          Edit
                        </Link>
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
