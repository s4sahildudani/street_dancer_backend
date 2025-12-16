require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,  // Increased to 10 seconds for Vercel cold starts
    query_timeout: 10000,  // Query timeout
    max: 10,  // Maximum pool connections
    idleTimeoutMillis: 30000  // Close idle connections after 30 seconds
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL (Neon)');
});

pool.on('error', (err) => {
    console.error('❌ DB Connection Failed:', err);
});

// MSSQL compatible types
const sql = {
    VarChar: 'VARCHAR',
    Int: 'INT',
    DateTime: 'TIMESTAMP',
    Bit: 'BOOLEAN',
    Decimal: 'DECIMAL'
};

// Create request object class
class RequestObject {
    constructor() {
        this.params = [];
    }

    input(name, type, value) {
        this.params.push({ name, value });
        return this; // Enable chaining
    }

    async query(queryString) {
        let pgQuery = queryString;
        const sortedParams = [];

        // Replace @param with $1, $2, etc.
        this.params.forEach((param, index) => {
            const regex = new RegExp(`@${param.name}\\b`, 'g');
            pgQuery = pgQuery.replace(regex, `$${index + 1}`);
            sortedParams.push(param.value);
        });

        try {
            const result = await pool.query(pgQuery, sortedParams);
            
            return {
                recordset: result.rows,
                rowsAffected: [result.rowCount]
            };
        } catch (err) {
            console.error('❌ Query Error:', err.message);
            throw err;
        }
    }
}

// Wrapper to maintain MSSQL-like syntax
const poolPromise = Promise.resolve({
    request: () => new RequestObject()
});

module.exports = {
    sql,
    poolPromise
};