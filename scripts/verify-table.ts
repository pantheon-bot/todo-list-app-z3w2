import { connect } from '@tidbcloud/serverless';

async function verifyTable() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const connection = connect({ url: process.env.DATABASE_URL });

  try {
    console.log('Verifying todos table...');

    // Try to query the table directly
    const result = await connection.execute('SELECT * FROM todos LIMIT 1');
    console.log('✅ Table exists! Result:', result);
  } catch (error: any) {
    console.error('❌ Error querying table:', error.message);

    // Try to show tables
    try {
      const tables = await connection.execute('SHOW TABLES');
      console.log('Available tables:', tables);
    } catch (e) {
      console.error('Could not show tables:', e);
    }

    // Try to create the table
    console.log('\nAttempting to create table...');
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          is_completed TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Table created successfully!');

      // Verify again
      const verifyResult = await connection.execute('SELECT * FROM todos LIMIT 1');
      console.log('✅ Table now exists! Result:', verifyResult);
    } catch (createError) {
      console.error('❌ Error creating table:', createError);
      throw createError;
    }
  }
}

verifyTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
