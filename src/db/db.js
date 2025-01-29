// db.js (Ensure this is a promise-based connection pool)
import mysql from "mysql2/promise"; // Correct import
import { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } from "../contants.js";

// Create a promise-based pool
const pool = mysql.createPool({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASSWORD || "Vp1@7763",
  database: DB_NAME || "bartersystem",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; // Use the pool instance
