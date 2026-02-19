import Link from "next/link";
import {
  Package,
  Factory,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your manufacturing operations
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Inventory summary - spans 2 on large */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Inventory Overview
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inventory" className="flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="rounded-lg bg-muted/50 p-4 flex-1">
                <p className="text-2xl font-semibold">1,247</p>
                <p className="text-xs text-muted-foreground">In Stock (SKUs)</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-4 flex-1">
                <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">23</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-4 flex-1">
                <p className="text-2xl font-semibold text-destructive">5</p>
                <p className="text-xs text-muted-foreground">Out of Stock</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span>3 items below reorder level need attention.</span>
            </div>
          </CardContent>
        </Card>

        {/* Production orders */}
        <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Factory className="h-4 w-4 text-muted-foreground" />
              Production
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/production">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Planned</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Finished (today)</span>
                <span className="font-medium">28</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Drag orders across columns to update status. BOM deduction is automated.</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily P&L */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Daily P&L
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/financials" className="flex items-center gap-1">
                View report <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/20 rounded-t-md h-24" style={{ height: "75%" }} />
                <span className="text-xs text-muted-foreground">Revenue</span>
                <span className="text-sm font-semibold">$42.5k</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-t-md h-16" style={{ height: "50%" }} />
                <span className="text-xs text-muted-foreground">COGS</span>
                <span className="text-sm font-semibold">$18.2k</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Gross margin today: 57%</span>
            </div>
          </CardContent>
        </Card>

        {/* Procurement */}
        <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              Procurement
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/procurement">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Suppliers</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">POs (open)</span>
                <Badge variant="outline">12</Badge>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Manage suppliers and create purchase orders from low-stock alerts.
            </p>
          </CardContent>
        </Card>

        {/* Quick actions / Audit */}
        <Card className="md:col-span-2 lg:col-span-3 border-border/80 bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            <CardDescription>Audit trail for stock and order changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Stock adjustment: SKU-8821 +50 units</span>
                  <span className="text-xs text-muted-foreground">John D. · 2m ago · Receipt from PO-1002</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Production order PRO-204 moved to Finished</span>
                  <span className="text-xs text-muted-foreground">System · 15m ago · BOM deducted</span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Purchase order PO-1003 sent to supplier</span>
                  <span className="text-xs text-muted-foreground">Jane M. · 1h ago</span>
                </li>
              </ul>
            </div>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/audit-logs">View full audit logs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
