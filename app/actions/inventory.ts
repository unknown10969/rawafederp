"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const type = formData.get("type") as string;
  const unit = (formData.get("unit") as string) || "pcs";
  const lowStockThreshold = parseFloat((formData.get("lowStockThreshold") as string) || "0");

  if (!name?.trim() || !sku?.trim() || !type) {
    return { error: "Name, SKU, and Type are required." };
  }

  try {
    await prisma.product.create({
      data: {
        name: name.trim(),
        sku: sku.trim(),
        type: type as "raw" | "finished",
        unit: unit.trim(),
        lowStockThreshold: isNaN(lowStockThreshold) ? 0 : lowStockThreshold,
      },
    });
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    redirect("/inventory");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product.";
    return { error: message };
  }
}
