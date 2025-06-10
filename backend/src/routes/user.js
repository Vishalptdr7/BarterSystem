import { Router } from "express";

// Import controllers
import {
  register,login,verifyOTP,logout,forgotPassword,currentUser
  ,resetPassword,
  deleteUser,
  editProfile,
  resendOtp,
  getAllUsers,
  getUserById,
} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT, isAdmin, isUser } from "../middlewares/auth.js";

// Routes
const router = Router();

// User registration route
router.route("/register").post(register);

// // User login route
router.route("/verifyOtp").post(verifyOTP);
// User Login Route
router.route("/login").post(login);

// router.get("/dashboard", verifyJWT, isUser, (req, res) => {
//   res.json({ message: "Welcome to the User Dashboard", user: req.user });
// });

// router.get("/admin-dashboard", verifyJWT, isAdmin, (req, res) => {
//   res.json({ message: "Welcome to the Admin Dashboard", user: req.user });
// });

//user logout 
router.route("/logout").post(verifyJWT, logout);
export default router;

//current user
 router.route("/current").get(verifyJWT,currentUser);


 router.route("/forgotPassword").post(forgotPassword)

 router.route("/resetPassword").post(resetPassword);

 router.route("/deleteUser/:id").post(verifyJWT,deleteUser);

 router.route("/editProfile").put(
   verifyJWT,
   upload.fields([
     {
       name: "profile_pic", // Make sure this matches `req.files.profile_pic`
       maxCount: 1,
     },
   ]),
   editProfile
 );


router.route("/resendOtp").post(resendOtp);

router.route("/getAllUsers").get(verifyJWT,getAllUsers);

router.route("/:user_id").get(verifyJWT,getUserById);
//  import chatRouter from "./chat.js";
//  router.use("/chat", chatRouter);
