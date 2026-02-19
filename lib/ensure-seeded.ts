import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const DEFAULT_PERMISSIONS: Array<{ name: string; description: string }> = [
  { name: "admin", description: "Full system access" },
  { name: "dashboard.view", description: "View dashboard" },
  { name: "inventory.view", description: "View inventory" },
  { name: "inventory.edit", description: "Edit inventory" },
  { name: "production.view", description: "View production/BOM" },
  { name: "production.produce", description: "Run production" },
  { name: "production.edit", description: "Edit BOM recipes" },
  { name: "purchases.view", description: "View purchases" },
  { name: "purchases.create", description: "Create purchases" },
  { name: "sales.view", description: "View sales" },
  { name: "sales.create", description: "Create sales" },
];

const DEFAULT_ROLES: Array<{ name: string; description: string; perms: string[] }> = [
  { name: "Admin", description: "Full system administrator", perms: DEFAULT_PERMISSIONS.map((p) => p.name) },
  {
    name: "Manager",
    description: "Production and inventory manager",
    perms: [
      "dashboard.view",
      "inventory.view",
      "inventory.edit",
      "production.view",
      "production.produce",
      "production.edit",
      "purchases.view",
      "purchases.create",
      "sales.view",
      "sales.create",
    ],
  },
  {
    name: "Operator",
    description: "Production operator",
    perms: ["dashboard.view", "inventory.view", "production.view", "production.produce", "purchases.view", "sales.view"],
  },
];

export async function ensureSystemSeeded() {
  // 1) Permissions
  await prisma.$transaction(
    DEFAULT_PERMISSIONS.map((p) =>
      prisma.permission.upsert({
        where: { name: p.name },
        update: { description: p.description },
        create: p,
      })
    )
  );

  // 2) Roles + role permissions
  for (const role of DEFAULT_ROLES) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    });

    const perms = await prisma.permission.findMany({ where: { name: { in: role.perms } } });
    await prisma.$transaction(
      perms.map((perm) =>
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: r.id, permissionId: perm.id } },
          update: {},
          create: { roleId: r.id, permissionId: perm.id },
        })
      )
    );
  }

  // 3) Master admin user
  const masterUsername = process.env.MASTER_USERNAME?.trim() || "Abaan";
  const masterPassword = process.env.MASTER_PASSWORD || "Abaan@123";
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (!adminRole) return;

  const existing = await prisma.user.findUnique({ where: { username: masterUsername } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(masterPassword, 10);
    await prisma.user.create({
      data: {
        username: masterUsername,
        passwordHash,
        fullName: "Master Administrator",
        isActive: true,
        roleId: adminRole.id,
      },
    });
  } else {
    // Ensure master stays active + admin role (do not overwrite password here)
    await prisma.user.update({
      where: { id: existing.id },
      data: { isActive: true, roleId: adminRole.id },
    });
  }
}

