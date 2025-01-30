import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import pool from "../db/db.js"; // Import MySQL connection pool

// const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401, "No token provided");
//     }

//     // Verify JWT token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Fetch user from MySQL
//     const [rows] = await pool.query(
//       "SELECT id, username, role FROM users WHERE id = ?",
//       [decodedToken.id]
//     );

//     if (rows.length === 0) {
//       throw new ApiError(401, "User not found");
//     }

//     // Attach user data to the request object
//     req.user = rows[0];

//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error.message);
//     throw new ApiError(401, error.message);
//   }
// });
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Try to get token from cookies first
    let token = req.cookies?.accessToken;

    // If not found in cookies, look for it in the Authorization header
    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    console.log("Received token from cookies:", req.cookies?.accessToken); // Log cookie value
    console.log(
      "Received token from Authorization header:",
      req.header("Authorization")
    ); // Log header value
    console.log("Final token extracted:", token); // Log final token

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from MySQL
    const [rows] = await pool.query(
      "SELECT id, username, role FROM users WHERE id = ?",
      [decodedToken.id]
    );

    if (rows.length === 0) {
      throw new ApiError(401, "User not found");
    }

    // Attach user data to the request object
    req.user = rows[0];

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new ApiError(401, error.message);
  }
});




export { verifyJWT };
