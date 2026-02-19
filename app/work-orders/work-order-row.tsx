"use client";

import { updateWorkOrderStatus } from "@/app/actions/work-orders";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type WorkOrder = {
  id: string;
  status: string;
  bom: {
    id: string;
  };
};

export function WorkOrderRow({ workOrder }: { workOrder: WorkOrder }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
    startTransition(async () => {
      await updateWorkOrderStatus(workOrder.id, newStatus);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {workOrder.status === "PENDING" && (
        <>
          <button
            onClick={() => handleStatusChange("IN_PROGRESS")}
            disabled={isPending}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            Start
          </button>
          <Link
            href={`/production?workOrderId=${workOrder.id}`}
            className="text-sm text-emerald-400 hover:underline"
          >
            Produce
          </Link>
        </>
      )}
      {workOrder.status === "IN_PROGRESS" && (
        <>
          <button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={isPending}
            className="text-sm text-emerald-400 hover:underline disabled:opacity-50"
          >
            Complete
          </button>
          <Link
            href={`/production?workOrderId=${workOrder.id}`}
            className="text-sm text-primary hover:underline"
          >
            Produce
          </Link>
        </>
      )}
      {workOrder.status === "COMPLETED" && (
        <span className="text-sm text-muted-foreground">Completed</span>
      )}
    </div>
  );
}
