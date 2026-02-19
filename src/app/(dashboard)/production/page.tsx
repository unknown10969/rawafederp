import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

export default function ProductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Production (MRP)</h1>
        <p className="text-muted-foreground">
          Workflow view: drag orders from Planned → In Progress → Finished. BOM deduction automated.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Production Orders
          </CardTitle>
          <CardDescription>Kanban-style workflow with drag-and-drop and automated BOM deduction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Module placeholder. Add workflow columns and BOM deduction on status change.</p>
        </CardContent>
      </Card>
    </div>
  );
}
