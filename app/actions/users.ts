"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createUser(_prev: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.permissions?.includes("admin")) {
    return { error: "Unauthorized. Admin access required." };
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;
  const isActive = formData.get("isActive") === "true";

  if (!username?.trim() || !password) {
    return { error: "Username and password are required." };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username: username.trim(),
        passwordHash,
        fullName: fullName?.trim() || null,
        email: email?.trim() || null,
        roleId: roleId || null,
        isActive,
      },
    });
    revalidatePath("/users");
    redirect("/users");
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") {
      return { error: "Username already exists." };
    }
    return { error: "Failed to create user." };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.permissions?.includes("admin")) {
    return { error: "Unauthorized. Admin access required." };
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;
  const isActive = formData.get("isActive") === "true";

  if (!username?.trim()) {
    return { error: "Username is required." };
  }

  try {
    const data: {
      username: string;
      fullName: string | null;
      email: string | null;
      roleId: string | null;
      isActive: boolean;
      passwordHash?: string;
    } = {
      username: username.trim(),
      fullName: fullName?.trim() || null,
      email: email?.trim() || null,
      roleId: roleId || null,
      isActive,
    };

    if (password?.trim()) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath("/users");
    redirect("/users");
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") {
      return { error: "Username already exists." };
    }
    return { error: "Failed to update user." };
  }
}

export async function updateMasterPassword(_prev: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.permissions?.includes("admin")) {
    return { error: "Unauthorized. Admin access required." };
  }

  const username = formData.get("username") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!username || !newPassword) {
    return { error: "Username and new password are required." };
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: { passwordHash },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { error: "Failed to update password." };
  }
}
