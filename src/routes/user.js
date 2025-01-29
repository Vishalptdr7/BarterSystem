import { Router } from "express";

// Import controllers
import {
  register
  
} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

// Routes
const router = Router();

// User registration route
router.route("/register").post(register);

// // User login route
// router.route("/users/login").post(login);

// // Get user details - Requires authentication
// router.route("/users/me").get(verifyJWT, getUserDetails);

// // Update user details - Requires authentication
// router.route("/users/me").put(verifyJWT, updateUser);

// // Delete user account - Requires authentication
// router.route("/users/me").delete(verifyJWT, deleteUser);

export default router;
