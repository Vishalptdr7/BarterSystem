import { Router } from "express";
const messageRouter=Router();
import {upload} from "../middlewares/multer.js"
import { sendMessage,getMessages,getUsersForSidebar,markMessageAsRead } from "../controllers/message.js";
import { verifyJWT } from "../middlewares/auth.js";


messageRouter.route("/:receiver_id").post(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 10,
    },
  ]),
  sendMessage
);


messageRouter.route("/user").get(verifyJWT, getUsersForSidebar);

messageRouter.route("/:receiver_id").get(verifyJWT,getMessages);

messageRouter.route("/mark_read").post(verifyJWT,markMessageAsRead);



export {messageRouter};