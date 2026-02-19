"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createExpense(_prev: unknown, formData: FormData) {
  const description = (formData.get("description") as string)?.trim();
  const amount = parseFloat((formData.get("amount") as string) || "0");
  const category = (formData.get("category") as string)?.trim() || null;

  if (!description || amount <= 0) {
    return { error: "Description and a positive amount are required." };
  }

  try {
    const session = await getServerSession(authOptions);
    await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        createdById: session?.user?.id,
      },
    });
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    redirect("/expenses");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add expense.";
    return { error: message };
  }
}
