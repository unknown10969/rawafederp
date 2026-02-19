import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default permissions
  const permissions = [
    { name: "admin", description: "Full system access" },
    { name: "inventory.view", description: "View inventory" },
    { name: "inventory.edit", description: "Edit inventory" },
    { name: "production.view", description: "View production/BOM" },
    { name: "production.produce", description: "Produce items" },
    { name: "production.edit", description: "Edit BOM recipes" },
    { name: "purchases.view", description: "View purchases" },
    { name: "purchases.create", description: "Create purchases" },
    { name: "sales.view", description: "View sales" },
    { name: "sales.create", description: "Create sales" },
    { name: "dashboard.view", description: "View dashboard" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // Create Admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Full system administrator",
    },
  });

  // Connect all permissions to Admin role
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: (await prisma.permission.findUnique({ where: { name: perm.name } }))!.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: (await prisma.permission.findUnique({ where: { name: perm.name } }))!.id,
      },
    });
  }

  // Create Manager role with limited permissions
  const managerRole = await prisma.role.upsert({
    where: { name: "Manager" },
    update: {},
    create: {
      name: "Manager",
      description: "Production and inventory manager",
    },
  });

  const managerPerms = [
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
  ];

  for (const permName of managerPerms) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: managerRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // Create Operator role with basic permissions
  const operatorRole = await prisma.role.upsert({
    where: { name: "Operator" },
    update: {},
    create: {
      name: "Operator",
      description: "Production operator",
    },
  });

  const operatorPerms = [
    "dashboard.view",
    "inventory.view",
    "production.view",
    "production.produce",
    "purchases.view",
    "sales.view",
  ];

  for (const permName of operatorPerms) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: operatorRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: operatorRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // Create master admin user (Abaan)
  const passwordHash = await bcrypt.hash("Abaan@123", 10);
  await prisma.user.upsert({
    where: { username: "Abaan" },
    update: {},
    create: {
      username: "Abaan",
      passwordHash,
      fullName: "Master Administrator",
      email: "admin@erp.local",
      isActive: true,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
