import { Router } from "express";

// Import controllers
import {
  register,login,verifyOTP,logout,forgotPassword,currentUser
  ,resetPassword,
  deleteUser,
  editProfile
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
router.route("/logout").post(verifyJWT, logout);
export default router;

//current user
 router.route("/current").get(verifyJWT,currentUser);


 router.route("/forgotPassword").post(verifyJWT,forgotPassword)

 router.route("/resetPassword").post(verifyJWT,resetPassword);

 router.route("/deleteUser/:id").post(verifyJWT,deleteUser);

//  router.route("/editProfile").put(
//    verifyJWT,
//    upload.fields([
//      {
//        name: "profile_pic", // Make sure this matches `req.files.profile_pic`
//        maxCount: 1,
//      },
//    ]),
//    editProfile
//  );
router.route("/editProfile").put(
  verifyJWT,
  (req, res, next) => {
    // Store user_id before multer modifies req
    res.locals.user = req.user;
    next();
  },
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  (req, res, next) => {
    // Restore user_id after multer modifies req
    req.user = res.locals.user;
    next();
  },
  editProfile
);

