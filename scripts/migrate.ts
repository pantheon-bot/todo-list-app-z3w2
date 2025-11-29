import { readFileSync } from 'fs';
import { join } from 'path';
import { connect } from '@tidbcloud/serverless';

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const connection = connect({ url: process.env.DATABASE_URL });

  try {
    // Read and execute the migration file
    const migrationPath = join(process.cwd(), 'migrations', '001_create_todos_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log('Running migrations...');

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await connection.execute(statement);
    }

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
