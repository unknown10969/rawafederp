"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkLowStock } from "@/lib/check-low-stock";

/**
 * When a Purchase is logged: create the purchase record and automatically
 * update the product's quantity and average cost.
 * New average cost = (Q1*C1 + q*p) / (Q1 + q)
 */
export async function createPurchase(_prev: unknown, formData: FormData) {
  const productId = formData.get("productId") as string;
  const supplierId = (formData.get("supplierId") as string) || null;
  const quantity = parseFloat((formData.get("quantity") as string) || "0");
  const unitPrice = parseFloat((formData.get("unitPrice") as string) || "0");

  if (!productId || quantity <= 0 || unitPrice < 0) {
    return { error: "Product, quantity (positive), and unit price are required." };
  }

  const totalAmount = quantity * unitPrice;

  try {
    const session = await getServerSession(authOptions);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { error: "Product not found." };

    const Q1 = product.quantity;
    const C1 = product.averageCost;
    const newTotalQty = Q1 + quantity;
    const newAverageCost = Q1 + quantity === 0 ? 0 : (Q1 * C1 + quantity * unitPrice) / newTotalQty;

    await prisma.$transaction([
      prisma.purchase.create({
        data: {
          productId,
          supplierId: supplierId || undefined,
          quantity,
          unitPrice,
          totalAmount,
          createdById: session?.user?.id,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { quantity: newTotalQty, averageCost: newAverageCost },
      }),
    ]);

    // Check for low stock alerts after purchase
    await checkLowStock();

    revalidatePath("/purchases");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    revalidatePath("/alerts");
    redirect("/purchases");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to log purchase.";
    return { error: message };
  }
}
