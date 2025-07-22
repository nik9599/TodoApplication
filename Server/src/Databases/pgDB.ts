
// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    max: 10, // max concurrent connections
    idleTimeoutMillis: 30000, // close idle clients after 30s
    connectionTimeoutMillis: 2000, // fail if not connected in 2s
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL pool connected (non-blocking)');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected PG pool error:', err);
});

export default pool;