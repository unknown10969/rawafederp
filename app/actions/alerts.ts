"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function resolveAlert(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const alertId = formData.get("alertId") as string;
  if (!alertId) {
    return { error: "Alert ID required" };
  }

  try {
    await prisma.lowStockAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedById: session.user.id,
      },
    });
    revalidatePath("/alerts");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to resolve alert" };
  }
}
