require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_UR,
  ssl: {
    rejectUnauthorized: false
  }
});

async function insertData() {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      ['Sahil Dudani', 's4sahil.dudani@gmail.com']
    );
    console.log('✅ Data inserted successfully!');
    console.log('Inserted user:', result.rows[0]);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    pool.end();
  }
}

insertData();