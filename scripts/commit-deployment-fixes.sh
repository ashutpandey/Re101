#!/bin/bash

# Commit deployment fixes
git add -A
git commit -m "fix: resolve deployment issues

- Convert backend from CommonJS to ES modules for Vercel compatibility
- Update vercel.json with proper build and routing configuration
- Add proper API handler for Vercel Serverless Functions
- Configure CORS and MongoDB URI support
- Fix Node.js module system consistency between frontend and backend
- Create environment configuration files for production deployment"

echo "✓ Changes committed successfully"
