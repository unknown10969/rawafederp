"use client";

import { generateSalePDF } from "@/lib/pdf";
import { FileDown } from "lucide-react";

type Sale = {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  soldAt: Date;
  customer?: { name: string } | null;
};

export function SalePDFButton({ sale }: { sale: Sale }) {
  function handleDownload() {
    const doc = generateSalePDF(sale);
    doc.save(`sale-${sale.id}-${new Date(sale.soldAt).toISOString().split("T")[0]}.pdf`);
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
