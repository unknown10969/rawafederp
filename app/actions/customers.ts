"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createCustomer(_prev: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;

  if (!name) {
    return { error: "Customer name is required." };
  }

  try {
    await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        address,
      },
    });
    revalidatePath("/customers");
    redirect("/customers");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create customer.";
    return { error: message };
  }
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;

  if (!name) {
    return { error: "Customer name is required." };
  }

  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        phone,
        email,
        address,
      },
    });
    revalidatePath("/customers");
    redirect("/customers");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update customer.";
    return { error: message };
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    await prisma.customer.delete({
      where: { id: customerId },
    });
    revalidatePath("/customers");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete customer.";
    return { error: message };
  }
}
