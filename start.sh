#!/bin/bash
# Hostinger startup script
# This script ensures the database is ready before starting the app

# Generate Prisma client if needed
npx prisma generate

# Start the application
# Hostinger will set PORT environment variable automatically
npm start
