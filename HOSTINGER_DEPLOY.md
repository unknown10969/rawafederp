# Hostinger Deployment Guide

## Quick Setup Steps

### 1. Prerequisites
- Hostinger account with Node.js hosting
- GitHub repository with your code
- Domain or subdomain configured

### 2. Hostinger Control Panel Configuration

#### Step 1: Connect GitHub Repository
1. Log in to Hostinger control panel
2. Navigate to **Advanced** → **Git** (or **Node.js** / **Application Manager**)
3. Click **Connect Repository**
4. Authorize Hostinger to access your GitHub account
5. Select your repository: `manufacturing-erp`
6. Select branch: `main` (or your production branch)

#### Step 2: Configure Node.js Application
1. **Node.js Version**: Set to **20.x** (required)
2. **Root Directory**: Leave empty or set to `/` (project root)
3. **Build Command**:
   ```bash
   npm ci && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
   ```
   
   **Critical**: The `npx prisma db push` creates all database tables (Supplier, Customer, WorkOrder, etc.) before building, preventing build errors.
4. **Start Command**:
   ```bash
   npm start
   ```
   OR (if using standalone):
   ```bash
   node .next/standalone/server.js
   ```

#### Step 3: Environment Variables
Add these in the Hostinger control panel under **Environment Variables**:

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com
```

**Important**: 
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- Replace `yourdomain.com` with your actual Hostinger domain

#### Step 4: First-Time Database Setup
After the first deployment, you need to initialize the database:

**Option A: Via SSH (Recommended)**
1. Connect via SSH to your Hostinger server
2. Navigate to your project directory
3. Run:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

**Option B: Via Hostinger Terminal/Console**
1. In Hostinger control panel, find **Terminal** or **Console**
2. Navigate to your project directory
3. Run the same commands as Option A

### 3. Auto-Deployment Setup

Hostinger will automatically deploy when you push to your connected branch (e.g., `main`).

**Workflow**:
1. Push code to GitHub
2. GitHub Actions runs CI checks (lint + build)
3. If CI passes, Hostinger pulls the latest code
4. Hostinger runs build command
5. Application restarts with new code

### 4. Post-Deployment Checklist

- [ ] Database initialized (`npx prisma db push && npm run db:seed`)
- [ ] Environment variables set correctly
- [ ] Application accessible at your domain
- [ ] Can log in with master credentials (Abaan/Abaan@123)
- [ ] All pages load correctly
- [ ] PDF generation works (test Sales/Purchases PDF download)

### 5. Troubleshooting

#### Build Fails
- Check Node.js version is set to 20
- Verify all environment variables are set
- Check build logs in Hostinger control panel

#### Database Errors
- Ensure `DATABASE_URL` points to a writable directory
- Run `npx prisma db push` manually via SSH
- Check file permissions on `prisma/dev.db`

#### Application Won't Start
- Verify start command is correct (`npm start`)
- Check Node.js version matches `.nvmrc` (20)
- Review application logs in Hostinger

#### PDF Generation Not Working
- Ensure `jspdf` package is installed (should be in dependencies)
- Check browser console for errors
- Verify client-side JavaScript is enabled

### 6. Maintenance

**Updating the Application**:
1. Make changes locally
2. Test with `npm run build`
3. Push to GitHub
4. Hostinger auto-deploys (or manually trigger deploy)

**Database Backups**:
- SQLite database is at `prisma/dev.db`
- Download via FTP/SSH regularly
- Hostinger may have automatic backup options

**Monitoring**:
- Check application logs in Hostinger control panel
- Monitor error logs for issues
- Set up uptime monitoring if needed

### 7. Performance Optimization

For better performance on Hostinger:
- The `standalone` output in `next.config.mjs` creates a smaller build
- SQLite is single-file, perfect for Hostinger
- Consider enabling Hostinger's CDN if available
- Monitor database size (SQLite works well up to several GB)

### 8. Security Notes

- Never commit `.env` files
- Use strong `NEXTAUTH_SECRET` in production
- Change master password after first login
- Regularly update dependencies (`npm audit fix`)
- Keep Node.js version updated

## Support

If you encounter issues:
1. Check Hostinger documentation
2. Review application logs
3. Verify all configuration steps above
4. Test locally first before deploying
