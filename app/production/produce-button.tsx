"use client";

import { produceBOM } from "@/app/actions/production";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function ProduceButton({ bomId }: { bomId: string; bomName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const [wasteQuantity, setWasteQuantity] = useState(0);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await produceBOM(bomId, quantity, wasteQuantity);
      if (result.error) setMessage({ type: "error", text: result.error });
      else {
        setMessage({ type: "success", text: "Production run completed." });
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">Batches:</label>
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <label className="text-xs text-muted-foreground">Waste:</label>
        <input
          type="number"
          min={0}
          step="0.001"
          value={wasteQuantity}
          onChange={(e) => setWasteQuantity(parseFloat(e.target.value) || 0)}
          className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="0"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Producing..." : "Produce"}
        </button>
      </div>
      {message && (
        <span
          className={`text-xs ${message.type === "error" ? "text-red-400" : "text-emerald-400"}`}
        >
          {message.text}
        </span>
      )}
    </form>
  );
}
