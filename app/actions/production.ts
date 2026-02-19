"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkLowStock } from "@/lib/check-low-stock";

/**
 * Create a BOM (recipe) with items. itemsJson: JSON array of { productId, quantityRequired }
 */
export async function createBOM(formData: FormData) {
  const name = formData.get("name") as string;
  const outputProductId = formData.get("outputProductId") as string;
  const outputQuantity = parseFloat((formData.get("outputQuantity") as string) || "1");
  const itemsJson = formData.get("items") as string;

  if (!name?.trim() || !outputProductId || outputQuantity <= 0) {
    return { error: "Recipe name, output product, and output quantity are required." };
  }

  let items: { productId: string; quantityRequired: number }[] = [];
  try {
    if (itemsJson?.trim()) items = JSON.parse(itemsJson) as { productId: string; quantityRequired: number }[];
  } catch {
    return { error: "Invalid items JSON." };
  }

  try {
    await prisma.bOM.create({
      data: {
        name: name.trim(),
        outputProductId,
        outputQuantity,
        items: {
          create: items.filter((i) => i.productId && i.quantityRequired > 0),
        },
      },
    });
    revalidatePath("/production");
    redirect("/production");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create recipe.";
    return { error: message };
  }
}

/**
 * Produce: subtract raw materials (BOM items * batches + waste), add finished good (output * batches only).
 * Waste is subtracted from raw materials but does not contribute to finished goods output.
 * Fails if any input has insufficient stock.
 */
export async function produceBOM(bomId: string, quantityProduced: number, wasteQuantity: number = 0) {
  if (!bomId || quantityProduced <= 0) {
    return { error: "Invalid BOM or quantity." };
  }

  if (wasteQuantity < 0) {
    return { error: "Waste quantity cannot be negative." };
  }

  try {
    const bom = await prisma.bOM.findUnique({
      where: { id: bomId },
      include: { items: { include: { product: true } }, outputProduct: true },
    });
    if (!bom) return { error: "Recipe not found." };

    // Calculate total needed including waste
    for (const item of bom.items) {
      const needed = item.quantityRequired * quantityProduced + wasteQuantity;
      if (item.product.quantity < needed) {
        return {
          error: `Insufficient stock for "${item.product.name}". Need ${needed} ${item.product.unit} (including waste), have ${item.product.quantity}.`,
        };
      }
    }

    // Output quantity is only based on batches, not waste
    const outputQty = bom.outputQuantity * quantityProduced;

    const session = await getServerSession(authOptions);

    await prisma.$transaction([
      ...bom.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantityRequired * quantityProduced + wasteQuantity } },
        })
      ),
      prisma.product.update({
        where: { id: bom.outputProductId },
        data: { quantity: { increment: outputQty } },
      }),
      prisma.productionRun.create({
        data: {
          bomId,
          quantityProduced,
          wasteQuantity,
          createdById: session?.user?.id,
        },
      }),
    ]);

    // Check for low stock alerts after production
    await checkLowStock();

    revalidatePath("/production");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    revalidatePath("/alerts");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Production failed.";
    return { error: message };
  }
}
