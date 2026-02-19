# Manufacturing ERP System

A professional, high-end Manufacturing ERP built with Next.js, Tailwind CSS, Prisma, and SQLite.

## Features

- 🔐 **Authentication & Authorization**
  - Master login (Abaan/Abaan@123)
  - User management with role-based access control (RBAC)
  - Customizable permissions per role

- 📊 **Dashboard**
  - Revenue, Expenses, and Profit tracking
  - Low stock alerts overview

- 📦 **Inventory Management**
  - Searchable product table
  - Low stock status badges (Red/Green)
  - Average cost tracking

- 🏭 **Production (BOM)**
  - Recipe management
  - One-click production (auto-deducts raw materials, adds finished goods)
  - Stock validation before production

- 💰 **Purchases**
  - Log purchases
  - **Automatic average cost calculation** when purchases are logged

- 📄 **Expenses**
  - Log non-inventory costs (utilities, labor, shipping, etc.)
  - Included in Dashboard expenses and profit

- 💵 **Sales**
  - Record sales transactions
  - Revenue tracking

- ⚠️ **Low Stock Alerts**
  - Automatic alerts when products fall below threshold
  - Alert resolution tracking

- 👥 **User Management** (Admin only)
  - Create/edit users
  - Assign roles and permissions
  - Change master password

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

**⚠️ Important**: After updating the schema (adding Supplier, Customer, WorkOrder models), you MUST run this command again.

### 3. Create Database Tables

```bash
npx prisma db push
```

**⚠️ Important**: This will create/update all database tables including the new models (Supplier, Customer, WorkOrder).

### 4. Seed Database (Create Master User & Roles)

```bash
npm run db:seed
```

This creates:
- Master admin user: **Abaan** / **Abaan@123**
- Default roles: Admin, Manager, Operator
- Permissions system

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Login

- **Username:** Abaan
- **Password:** Abaan@123

You can change the master password in Settings after logging in.

## Database

Uses SQLite (`dev.db`) - a single file database perfect for Hostinger hosting.

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

For **production**, set `NEXTAUTH_URL` to your live URL (e.g. `https://yourdomain.com`).

## Project Structure

```
app/
  ├── actions/          # Server actions
  ├── alerts/          # Low stock alerts page
  ├── dashboard/       # Dashboard
  ├── inventory/       # Inventory management
  ├── login/           # Login page
  ├── production/      # BOM & Production
  ├── purchases/       # Purchase logging
  ├── sales/           # Sales recording
  ├── settings/        # Settings (master password)
  └── users/           # User management (admin)

components/            # Reusable components
lib/                   # Utilities & DB client
prisma/                # Prisma schema & seed
```

## Key Features Explained

### Automatic Average Cost Update

When you log a purchase:
- Product quantity increases
- Average cost recalculates: `(Q1*C1 + q*p) / (Q1 + q)`

### Production Logic

When you click "Produce":
1. Validates all raw materials have sufficient stock
2. Deducts raw materials (BOM items × batches)
3. Adds finished goods (output quantity × batches)
4. Creates production run record
5. Checks for low stock alerts

### Low Stock Alerts

Automatically created when:
- Product quantity < low stock threshold
- After purchases or production runs

Alerts appear on Dashboard and Alerts page.

### Role-Based Access Control

- **Admin:** Full access (users, settings, all modules)
- **Manager:** Production, inventory, purchases, sales
- **Operator:** View-only + production execution

## Production Deployment

### Deploy to Hostinger using GitHub

1. **Push your code to GitHub**  
   Ensure the repo is connected and the **CI workflow** runs on push (see `.github/workflows/ci.yml`). This runs `lint` and `build` so only passing code gets deployed.

2. **Hostinger setup**
   - In Hostinger control panel, open **Advanced** → **Git** (or **Node.js** / **Application**).
   - Connect your GitHub repository and select the branch (e.g. `main`).
   - Set **Node.js version** to 20 (or 18+).
   - Set **Build command:**  
     `npm ci && npx prisma generate && npx prisma db push --accept-data-loss && npm run build`
     
     **⚠️ Critical**: The `npx prisma db push` creates all database tables before building, preventing "table does not exist" errors.
   - Set **Start command:**  
     `npm start`  
     (Or, if using standalone output: `node .next/standalone/server.js` from project root.)
   - Set **Root directory** to your app root (where `package.json` and `prisma/` are).

3. **Environment variables (Hostinger)**  
   In the same panel, add:
   - `DATABASE_URL` = `file:./prisma/dev.db` (use a writable path; Hostinger often uses the project directory)
   - `NEXTAUTH_SECRET` = a long random string (e.g. from `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = your live URL, e.g. `https://yourdomain.com`

4. **First-time database**
   - After the first deploy, run (via SSH or Hostinger’s “Run script” if available):  
     `npx prisma db push && npm run db:seed`  
   - Or use a one-off Node.js script that runs `db push` and `seed` so the SQLite file and tables exist.

5. **Auto deploy**
   - Every push to `main` (or your connected branch) will trigger a new build on Hostinger if Git auto-deploy is enabled.
   - The GitHub Action runs `npm run lint` and `npm run build` so broken code fails in CI and doesn’t get deployed.

### Checklist

- [ ] `NEXTAUTH_SECRET` set to a secure value in production
- [ ] `NEXTAUTH_URL` set to your production URL
- [ ] `DATABASE_URL` points to a writable path (e.g. `file:./prisma/dev.db`)
- [ ] Run `npx prisma db push` and `npm run db:seed` once on the server
- [ ] Build command includes `npx prisma generate` and `npm run build`

## License

Private - Manufacturing ERP System
"# rawafederp" 
"# rawafederp" 
"# rawafederp" 
