"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createSale(_prev: unknown, formData: FormData) {
  const productId = formData.get("productId") as string;
  const customerId = (formData.get("customerId") as string) || null;
  const quantity = parseFloat((formData.get("quantity") as string) || "0");
  const unitPrice = parseFloat((formData.get("unitPrice") as string) || "0");

  if (!productId || quantity <= 0 || unitPrice < 0) {
    return { error: "Product, quantity (positive), and unit price are required." };
  }

  const totalAmount = quantity * unitPrice;

  try {
    const session = await getServerSession(authOptions);
    await prisma.$transaction([
      prisma.sale.create({
        data: {
          productId,
          customerId: customerId || undefined,
          quantity,
          unitPrice,
          totalAmount,
          createdById: session?.user?.id,
        },
      }),
      ...(customerId
        ? [
            prisma.customer.update({
              where: { id: customerId },
              data: { totalOrders: { increment: 1 } },
            }),
          ]
        : []),
    ]);
    revalidatePath("/sales");
    revalidatePath("/dashboard");
    revalidatePath("/customers");
    redirect("/sales");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to record sale.";
    return { error: message };
  }
}
