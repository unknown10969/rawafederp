# Manufacturing ERP – Folder Structure

```
manufacturing-erp/
├── prisma/
│   ├── schema.prisma      # SQLite schema (Inventory, Production, Financials, Procurement, Audit)
│   └── dev.db             # SQLite DB (created on first db push)
├── src/
│   ├── app/
│   │   ├── (dashboard)/           # Route group – layout with sidebar + header
│   │   │   ├── layout.tsx         # Sidebar + Header + main content area
│   │   │   ├── page.tsx           # Dashboard home (Bento grid)
│   │   │   ├── inventory/         # Inventory module (tables, batch tracking)
│   │   │   ├── production/        # MRP workflow (Planned → In Progress → Finished)
│   │   │   ├── financials/        # Daily P&L, Revenue vs COGS
│   │   │   ├── procurement/       # Suppliers, Purchase Orders
│   │   │   ├── audit-logs/        # Audit log viewer
│   │   │   └── settings/
│   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   └── globals.css            # Design tokens (Enterprise Modern)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx        # Persistent nav (Dashboard, Inventory, Production, etc.)
│   │   │   └── header.tsx        # Top search bar + user
│   │   └── ui/                   # Shadcn-style components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── table.tsx
│   │       ├── separator.tsx
│   │       └── (dialog, etc. as needed)
│   └── lib/
│       ├── db.ts                  # Prisma client singleton
│       ├── utils.ts               # cn() for Tailwind
│       └── audit.ts               # logAudit() / logStockChange() for audit trail
├── .env                           # DATABASE_URL="file:./dev.db"
├── package.json
├── tailwind.config.ts
└── FOLDER_STRUCTURE.md
```

## Database schema (summary)

- **User** – who performed actions (for audit).
- **AuditLog** – entityType, entityId, action, field, oldValue, newValue, **reason**, userId, createdAt.
- **Product** – SKU, name, reorderLevel, cost.
- **InventoryBatch** – batch tracking (batchNumber, quantity, expiryDate).
- **StockMovement** – in/out/adjustment/production_deduction; links to audit via reason/metadata.
- **ProductionOrder** – status: planned | in_progress | finished; BOM deduction on status change.
- **BomItem** – finishedGoodId, componentId, quantityRequired.
- **DailyPl** – date, revenue, cogs (for P&L chart).
- **Supplier** – code, name, contact.
- **PurchaseOrder** / **PurchaseOrderLine** – POs and lines.

All stock level changes should go through logic that creates a **StockMovement** and calls **logStockChange()** (or **logAudit()**) with **reason** and **userId** so the audit log records who did it and why.
