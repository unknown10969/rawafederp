"use client";

import { generatePurchasePDF } from "@/lib/pdf";
import { FileDown } from "lucide-react";

type Purchase = {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  purchasedAt: Date;
  supplier?: { name: string } | null;
};

export function PurchasePDFButton({ purchase }: { purchase: Purchase }) {
  function handleDownload() {
    const doc = generatePurchasePDF(purchase);
    doc.save(`purchase-${purchase.id}-${new Date(purchase.purchasedAt).toISOString().split("T")[0]}.pdf`);
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      title="Download PDF"
    >
      <FileDown className="h-3 w-3" />
      PDF
    </button>
  );
}
