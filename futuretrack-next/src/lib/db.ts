import mysql, { Pool, PoolOptions } from "mysql2/promise";

const requiredEnv = ["DB_HOST", "DB_USER", "DB_NAME"] as const;

function hasDbConfig() {
  return requiredEnv.every((key) => Boolean(process.env[key]));
}

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
};

let pool: Pool | null = null;

export function getDbPool() {
  if (!hasDbConfig()) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }

  return pool;
}

export async function checkDbConnection() {
  const activePool = getDbPool();

  if (!activePool) {
    return {
      connected: false,
      reason: "Missing DB environment variables (DB_HOST, DB_USER, DB_NAME).",
    };
  }

  try {
    await activePool.query("SELECT 1");
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      reason: error instanceof Error ? error.message : "Unknown DB error",
    };
  }
}
