import { prisma } from "./db";

/**
 * Check all products and create low stock alerts if quantity < threshold
 * Call this after purchases, production, or any inventory changes
 */
export async function checkLowStock() {
  try {
    const products = await prisma.product.findMany({
      where: {
        lowStockThreshold: { gt: 0 },
      },
    });

    for (const product of products) {
      if (product.quantity < product.lowStockThreshold) {
        // Check if there's already an unresolved alert
        const existingAlert = await prisma.lowStockAlert.findFirst({
          where: {
            productId: product.id,
            isResolved: false,
          },
        });

        if (!existingAlert) {
          await prisma.lowStockAlert.create({
            data: {
              productId: product.id,
              currentQty: product.quantity,
              threshold: product.lowStockThreshold,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error checking low stock:", error);
  }
}
