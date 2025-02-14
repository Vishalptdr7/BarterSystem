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
//       "SELECT user_id, name, FROM users WHERE user_id = ?",
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
//});
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    console.log("Token:", token);

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      throw new ApiError(401, "Invalid or expired token");
    }

    if (!decodedToken.id) {
      throw new ApiError(401, "Invalid token payload, no user ID found");
    }

    // Fetch user from MySQL including `role`
    const [rows] = await pool.query(
      "SELECT user_id, name, role FROM users WHERE user_id = ?",
      [decodedToken.id]
    );

    if (rows.length === 0) {
      throw new ApiError(401, "User not found");
    }

    // Attach user data to the request object
    req.user = rows[0];
    console.log("User data attached to request:", req.user.user_id); // Debug log

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new ApiError(401, error.message);
  }
});


const isAdmin = asyncHandler((req, res, next) => {
  if ((req.user.role) !== 'admin') {
    console.log("user is",req.user?.password);
    return res.status(403).json({ message: "Access Forbidden. Admins only." });
  }
  
  next();
});

const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access Forbidden. Users only." });
  }
  console.log(req.user.role)
  next();
};

export { verifyJWT,isAdmin,isUser };
