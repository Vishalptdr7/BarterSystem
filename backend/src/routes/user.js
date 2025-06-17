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

const router = Router();

router.route("/register").post(register);

router.route("/verifyOtp").post(verifyOTP);
router.route("/login").post(login);


router.route("/logout").post(verifyJWT, logout);
export default router;

 router.route("/current").get(verifyJWT,currentUser);


 router.route("/forgotPassword").post(forgotPassword)

 router.route("/resetPassword").post(resetPassword);

 router.route("/deleteUser/:id").post(verifyJWT,deleteUser);

 router.route("/editProfile").put(
   verifyJWT,
   upload.fields([
     {
       name: "profile_pic",
       maxCount: 1,
     },
   ]),
   editProfile
 );


router.route("/resendOtp").post(resendOtp);

router.route("/getAllUsers").get(verifyJWT,getAllUsers);

router.route("/:user_id").get(verifyJWT,getUserById);

