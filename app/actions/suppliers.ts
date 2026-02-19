"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createSupplier(_prev: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const contactPerson = (formData.get("contactPerson") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const productsSupplied = (formData.get("productsSupplied") as string)?.trim() || null;

  if (!name) {
    return { error: "Supplier name is required." };
  }

  try {
    await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        phone,
        email,
        address,
        productsSupplied,
      },
    });
    revalidatePath("/suppliers");
    redirect("/suppliers");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create supplier.";
    return { error: message };
  }
}

export async function updateSupplier(supplierId: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const contactPerson = (formData.get("contactPerson") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const productsSupplied = (formData.get("productsSupplied") as string)?.trim() || null;

  if (!name) {
    return { error: "Supplier name is required." };
  }

  try {
    await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        name,
        contactPerson,
        phone,
        email,
        address,
        productsSupplied,
      },
    });
    revalidatePath("/suppliers");
    redirect("/suppliers");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update supplier.";
    return { error: message };
  }
}

export async function deleteSupplier(supplierId: string) {
  try {
    await prisma.supplier.delete({
      where: { id: supplierId },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete supplier.";
    return { error: message };
  }
}
