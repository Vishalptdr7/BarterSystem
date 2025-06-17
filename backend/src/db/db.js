import mysql from "mysql2/promise"; 
import { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } from "../contants.js";

const pool = mysql.createPool({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASSWORD || "Vp1@7763",
  database: DB_NAME || "bartersystem",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; 
