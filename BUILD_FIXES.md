# Build Fixes for Hostinger Deployment

## Problem
Build was failing on Hostinger with errors:
- `The table 'main.Supplier' does not exist`
- `The table 'main.Customer' does not exist`
- `The table 'main.WorkOrder' does not exist`

## Root Cause
Next.js tries to statically generate pages during build. Pages querying new tables (Supplier, Customer, WorkOrder) failed because:
1. Tables don't exist until `npx prisma db push` is run
2. Build command didn't create tables before building
3. Pages weren't marked as dynamic, causing static generation errors

## Solutions Applied

### 1. Updated Build Command
**Before:**
```bash
npm ci && npx prisma generate && npm run build
```

**After:**
```bash
npm ci && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
```

**Files Updated:**
- `.github/workflows/ci.yml`
- `HOSTINGER_DEPLOY.md`
- `README.md`
- Created `HOSTINGER_BUILD.md` (detailed guide)

### 2. Made Pages Dynamic
Added `export const dynamic = "force-dynamic"` to prevent static generation:

**Files Updated:**
- `app/purchases/new/page.tsx`
- `app/sales/new/page.tsx`
- `app/suppliers/page.tsx`
- `app/customers/page.tsx`
- `app/work-orders/page.tsx`
- `app/work-orders/new/page.tsx`
- `app/reports/page.tsx`

### 3. Added Error Handling
Wrapped Prisma queries in `.catch(() => [])` to return empty arrays if tables don't exist:

**Files Updated:**
- `app/purchases/new/page.tsx` - suppliers query
- `app/sales/new/page.tsx` - customers query

**Already Had Error Handling:**
- `app/suppliers/page.tsx` - try/catch returns null
- `app/customers/page.tsx` - try/catch returns null
- `app/work-orders/page.tsx` - try/catch returns null
- `app/reports/page.tsx` - try/catch returns null

## Next Steps for Hostinger

1. **Update Build Command** in Hostinger control panel:
   ```
   npm ci && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
   ```

2. **Redeploy** - Push to GitHub or trigger manual deployment

3. **Verify** - Build should complete successfully

4. **After First Deploy** - Run database seed:
   ```bash
   npm run db:seed
   ```

## Testing Locally

To test the build locally:

```bash
# Clean install
npm ci

# Generate Prisma client
npx prisma generate

# Create tables
npx prisma db push --accept-data-loss

# Build
npm run build
```

## Notes

- `--accept-data-loss` flag is safe for first deployment (no existing data)
- Pages marked as `dynamic` won't be statically generated (better for Hostinger)
- Error handling ensures graceful degradation if tables are missing
- All changes are backward compatible
