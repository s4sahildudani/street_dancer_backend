require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL (Neon)');
});

pool.on('error', (err) => {
    console.error('❌ DB Connection Failed:', err);
});

const sql = {
    VarChar: 'VARCHAR',
    Int: 'INT',
    DateTime: 'TIMESTAMP',
    Bit: 'BOOLEAN',
    Decimal: 'DECIMAL'
};

const poolPromise = Promise.resolve({
    request: () => {
        const params = [];
        const values = [];
        let paramCounter = 1;

        return {
            input: (name, type, value) => {
                params.push({ name, value });
                return this;
            },
            query: async (queryString) => {
                let pgQuery = queryString;
                const sortedParams = [];
                params.forEach((param, index) => {
                    const regex = new RegExp(`@${param.name}\\b`, 'g');
                    pgQuery = pgQuery.replace(regex, `$${index + 1}`);
                    sortedParams.push(param.value);
                });

                const result = await pool.query(pgQuery, sortedParams);

                return {
                    recordset: result.rows,
                    rowsAffected: [result.rowCount]
                };
            }
        };
    }
});

module.exports = {
    sql,
    poolPromise
};