import { Router } from "express";

// Import controllers
import {
  register,login,verifyOTP,logout,forgotPassword,
  
} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

// Routes
const router = Router();

// User registration route
router.route("/register").post(register);

// // User login route
router.route("/verifyOTP").post(verifyOTP);
// User Login Route
router.route("/login").post(login);

//user logout 
router.route("/test").get(async (req, res) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ message: "Token verified", decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

router.route("/logout").post(verifyJWT, logout);
export default router;
