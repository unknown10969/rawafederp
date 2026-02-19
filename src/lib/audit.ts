import { prisma } from "@/lib/db";

type EntityType = "inventory" | "production" | "purchase_order" | "financial";

interface LogAuditParams {
  entityType: EntityType;
  entityId: string;
  action: "create" | "update" | "delete" | "stock_change";
  userId: string;
  reason?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  metadata?: string;
}

/**
 * Record an audit log entry. Call this whenever stock level changes
 * to record WHO did it and WHY (e.g. "Receipt from PO-1002", "Production deduction PRO-204").
 */
export async function logAudit(params: LogAuditParams) {
  await prisma.auditLog.create({
    data: {
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      userId: params.userId,
      reason: params.reason ?? null,
      field: params.field ?? null,
      oldValue: params.oldValue ?? null,
      newValue: params.newValue ?? null,
      metadata: params.metadata ?? null,
    },
  });
}

/**
 * Record a stock change with audit. Use when adjusting inventory so
 * every change is traceable (who, why, old/new quantity).
 */
export async function logStockChange(params: {
  productId: string;
  batchId?: string;
  type: "in" | "out" | "adjustment" | "production_deduction";
  quantity: number;
  reason: string;
  userId: string;
  metadata?: string;
}) {
  await logAudit({
    entityType: "inventory",
    entityId: params.productId,
    action: "stock_change",
    userId: params.userId,
    reason: params.reason,
    field: "quantity",
    newValue: String(params.quantity),
    metadata: params.metadata
      ? JSON.stringify({
          batchId: params.batchId,
          type: params.type,
          ...(typeof params.metadata === "string" ? {} : params.metadata),
        })
      : params.batchId
        ? JSON.stringify({ batchId: params.batchId, type: params.type })
        : undefined,
  });
}
