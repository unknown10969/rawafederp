import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/db";
import { MasterPasswordForm } from "./master-password-form";

export default async function SettingsPage() {
  const masterUser = await prisma.user.findUnique({
    where: { username: "Abaan" },
  });

  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Settings" }]}
      />
      <div className="p-6 space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Master Account Password</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Change the password for the master administrator account (Abaan).
          </p>
          {masterUser ? (
            <MasterPasswordForm />
          ) : (
            <p className="text-sm text-muted-foreground">
              Master account not found. Run: npm run db:seed
            </p>
          )}
        </div>
      </div>
    </>
  );
}

