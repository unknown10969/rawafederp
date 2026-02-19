import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function ProcurementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Procurement</h1>
        <p className="text-muted-foreground">
          Manage Suppliers and generate Purchase Orders.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Suppliers & Purchase Orders
          </CardTitle>
          <CardDescription>Supplier management and PO creation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Module placeholder. Add supplier list and PO forms.</p>
        </CardContent>
      </Card>
    </div>
  );
}
