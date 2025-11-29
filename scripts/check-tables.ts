import { connect } from '@tidbcloud/serverless';

async function checkTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const connection = connect({ url: process.env.DATABASE_URL });

  try {
    console.log('Checking database tables...');

    const result = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', result);

    const rows = result.rows || [];
    if (rows.length === 0) {
      console.log('\nNo tables found. Running migration...');
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const migrationPath = join(process.cwd(), 'migrations', '001_create_todos_table.sql');
      const migrationSQL = readFileSync(migrationPath, 'utf-8');

      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await connection.execute(statement);
      }

      console.log('\n✅ Migration completed!');

      const newResult = await connection.execute('SHOW TABLES');
      console.log('Tables after migration:', newResult.rows);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
