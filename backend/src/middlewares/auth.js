import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
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


    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    if (!decodedToken.id) {
      throw new ApiError(401, "Invalid token payload, no user ID found");
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [decodedToken.id]
    );

    if (rows.length === 0) {
      throw new ApiError(401, "User not found");
    }

    req.user = rows[0];
    console.log("user logout");
    next();
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});


const isAdmin = asyncHandler((req, res, next) => {
  if ((req.user.role) !== 'admin') {
    return res.status(403).json({ message: "Access Forbidden. Admins only." });
  }
  
  next();
});

const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access Forbidden. Users only." });
  }
  next();
};

export { verifyJWT,isAdmin,isUser };
