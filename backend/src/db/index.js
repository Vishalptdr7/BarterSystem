import mysql from "mysql2";
import { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } from "../contants.js";

const dbconnect = async () => {
  try {
    const connection = mysql.createConnection({
      host: DB_HOST || "127.0.0.1", // MySQL host
      user: DB_USER|| "root", // MySQL username
      password: DB_PASSWORD || "Vp1@7763", // MySQL password
      database: DB_NAME || "bartersystem", // MySQL database name
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        throw err;
      }
      console.log(`Database Connected: ${connection.threadId}`);
    });

    const promiseConnection = mysql
      .createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      })
      .promise();

    return promiseConnection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default dbconnect;
