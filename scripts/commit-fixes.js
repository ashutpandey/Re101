import { execSync } from 'child_process';

try {
  console.log('[v0] Adding all changes to Git...');
  execSync('git add -A', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });

  console.log('[v0] Committing deployment fixes...');
  execSync(`git commit -m "fix: resolve deployment issues

- Convert backend from CommonJS to ES modules for Vercel compatibility
- Update vercel.json with proper build and routing configuration
- Add proper API handler for Vercel Serverless Functions
- Configure CORS and MongoDB URI support
- Fix Node.js module system consistency between frontend and backend
- Create environment configuration files for production deployment"`, { 
    cwd: '/vercel/share/v0-project', 
    stdio: 'inherit' 
  });

  console.log('[v0] ✓ Changes committed successfully');
} catch (error) {
  console.error('[v0] Git operation failed:', error.message);
  process.exit(1);
}
