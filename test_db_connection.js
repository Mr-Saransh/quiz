import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to DB');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
