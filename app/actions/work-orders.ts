"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createWorkOrder(_prev: unknown, formData: FormData) {
  const recipeId = formData.get("recipeId") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const quantityToProduce = parseFloat((formData.get("quantityToProduce") as string) || "0");

  if (!recipeId || !scheduledDate || quantityToProduce <= 0) {
    return { error: "Recipe, scheduled date, and quantity are required." };
  }

  try {
    const session = await getServerSession(authOptions);
    await prisma.workOrder.create({
      data: {
        recipeId,
        scheduledDate: new Date(scheduledDate),
        quantityToProduce,
        status: "PENDING",
        createdById: session?.user?.id,
      },
    });
    revalidatePath("/work-orders");
    redirect("/work-orders");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create work order.";
    return { error: message };
  }
}

export async function updateWorkOrderStatus(workOrderId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
  try {
    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: { status },
    });
    revalidatePath("/work-orders");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update work order.";
    return { error: message };
  }
}

export async function completeWorkOrder(workOrderId: string) {
  try {
    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: { status: "COMPLETED" },
    });
    revalidatePath("/work-orders");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to complete work order.";
    return { error: message };
  }
}
