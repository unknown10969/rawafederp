import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Data tables with status badges (In Stock, Low Stock, Out of Stock) and Batch Tracking.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory & Batch Tracking
          </CardTitle>
          <CardDescription>Professional data tables and batch tracking will be implemented here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Module placeholder. Connect to Prisma and add tables with status badges and batch tracking.</p>
        </CardContent>
      </Card>
    </div>
  );
}
