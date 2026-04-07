import { execSync } from 'child_process';

try {
  console.log('Adding all changes...');
  execSync('git add -A', { stdio: 'inherit' });

  console.log('Committing changes...');
  execSync('git commit -m "Migrate from MongoDB to Supabase PostgreSQL\n\n- Removed mongoose dependencies\n- Created Supabase client and library\n- Converted all routes to use Supabase queries\n- Updated database schema to PostgreSQL\n- Deleted MongoDB models\n- Added seed script for Supabase\n- Updated environment configuration"', { stdio: 'inherit' });

  console.log('Push to origin...');
  execSync('git push origin', { stdio: 'inherit' });

  console.log('\n✅ Successfully committed and pushed Supabase migration!');
} catch (error) {
  console.error('❌ Error during commit:', error.message);
  process.exit(1);
}
