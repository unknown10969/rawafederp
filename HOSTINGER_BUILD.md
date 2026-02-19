# Hostinger Build Configuration

## ⚠️ CRITICAL: Build Command for Hostinger

Use this **exact** build command in Hostinger control panel:

```bash
npm ci && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
```

### Why This Command?

1. `npm ci` - Clean install (faster, more reliable than `npm install`)
2. `npx prisma generate` - Generates Prisma client with new models (Supplier, Customer, WorkOrder)
3. `npx prisma db push --accept-data-loss` - **CRITICAL**: Creates all database tables before build
4. `npm run build` - Builds the Next.js application

**Without step 3**, the build will fail because Next.js tries to pre-render pages that query tables (Supplier, Customer, WorkOrder) that don't exist yet.

## Start Command

```bash
npm start
```

## Environment Variables (Required)

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=<generate-strong-secret>
NEXTAUTH_URL=https://yourdomain.com
```

## Node.js Version

**Must be set to 20** (see `.nvmrc` file)

## First Deployment Steps

1. **Push code to GitHub** (with updated build command)
2. **Connect repository in Hostinger**
3. **Set build command** (see above)
4. **Set environment variables**
5. **Deploy** - Hostinger will run the build command
6. **After first deploy**, SSH in and run:
   ```bash
   npm run db:seed
   ```
   This creates the master user (Abaan/Abaan@123)

## Troubleshooting Build Failures

### Error: "Table does not exist"
**Solution**: Ensure build command includes `npx prisma db push --accept-data-loss`

### Error: "Module not found"
**Solution**: Run `npm ci` (not `npm install`) in build command

### Error: "Prisma client not generated"
**Solution**: Ensure `npx prisma generate` is in build command before `npm run build`

## Auto-Deploy Setup

Once configured correctly:
- Every push to `main` branch triggers automatic deployment
- GitHub Actions validates code first
- Hostinger pulls latest code and rebuilds
- Application restarts automatically

## Database Location

- SQLite database: `prisma/dev.db`
- Ensure this path is writable
- Hostinger typically uses project root directory
- Database persists between deployments

## Performance Notes

- `standalone` output creates smaller build (~50MB vs ~200MB)
- SQLite is perfect for Hostinger (single file, no server needed)
- All pages marked as `dynamic` to prevent static generation issues
- Build time: ~2-3 minutes on Hostinger
