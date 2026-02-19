import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function FinancialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financials</h1>
        <p className="text-muted-foreground">
          Daily P&L: Revenue vs. COGS (Cost of Goods Sold).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily P&L
          </CardTitle>
          <CardDescription>Chart of Revenue vs COGS over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Module placeholder. Add Recharts daily P&L chart.</p>
        </CardContent>
      </Card>
    </div>
  );
}
