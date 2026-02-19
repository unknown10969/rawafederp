# Deployment Checklist for Hostinger

## Before Deploying

### 1. Local Setup Complete
- [ ] All dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Build succeeds (`npm run build`)
- [ ] Application runs locally (`npm run dev`)

### 2. Code Ready
- [ ] All features tested locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All new modules working (Suppliers, Customers, Work Orders, Reports)
- [ ] PDF generation tested
- [ ] Currency displays as QAR everywhere

### 3. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Main branch is up to date
- [ ] GitHub Actions CI passes (check Actions tab)

## Hostinger Configuration

### 4. Hostinger Control Panel Setup
- [ ] GitHub repository connected
- [ ] Branch set to `main` (or your production branch)
- [ ] Node.js version set to **20** (critical!)
- [ ] Build command: `npm ci && npx prisma generate && npm run build`
- [ ] Start command: `npm start`
- [ ] Root directory: `/` (or leave empty)

### 5. Environment Variables
- [ ] `DATABASE_URL` = `file:./prisma/dev.db`
- [ ] `NEXTAUTH_SECRET` = Generated secure random string
- [ ] `NEXTAUTH_URL` = Your production domain (e.g., `https://yourdomain.com`)

### 6. First Deployment
- [ ] Initial deployment completed
- [ ] Connected via SSH or Terminal
- [ ] Ran `npx prisma db push` successfully
- [ ] Ran `npm run db:seed` successfully
- [ ] Database file created at `prisma/dev.db`

### 7. Post-Deployment Verification
- [ ] Application accessible at your domain
- [ ] Login page loads
- [ ] Can log in with master credentials
- [ ] Dashboard displays correctly
- [ ] All navigation links work
- [ ] Can create Suppliers
- [ ] Can create Customers
- [ ] Can create Work Orders
- [ ] Production with waste tracking works
- [ ] PDF downloads work (Sales/Purchases)
- [ ] Reports page loads and shows data

### 8. Security
- [ ] Master password changed from default
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `.env` file not committed to Git
- [ ] Database file permissions set correctly

## Troubleshooting

### Build Fails
**Error**: Module not found or TypeScript errors
**Solution**: 
1. Run `npx prisma generate` locally first
2. Verify `npm run build` works locally
3. Check Node.js version is 20 in Hostinger

### Database Errors
**Error**: Tables don't exist or Prisma errors
**Solution**:
1. SSH into Hostinger
2. Run `npx prisma db push`
3. Run `npm run db:seed`
4. Verify `prisma/dev.db` file exists and is writable

### Application Won't Start
**Error**: Port already in use or startup fails
**Solution**:
1. Check start command is `npm start`
2. Verify Node.js version is 20
3. Check application logs in Hostinger control panel
4. Ensure all environment variables are set

### PDF Generation Not Working
**Error**: PDF button doesn't work or errors
**Solution**:
1. Verify `jspdf` is in `package.json` dependencies
2. Check browser console for JavaScript errors
3. Ensure client-side JavaScript is enabled
4. Test PDF generation locally first

## Quick Commands Reference

```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Update database schema
npx prisma db push

# Seed database (create master user)
npm run db:seed

# Build for production
npm run build

# Start production server
npm start
```

## Support Resources

- **Hostinger Documentation**: Check Hostinger's Node.js hosting docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Application Logs**: Check Hostinger control panel → Logs
