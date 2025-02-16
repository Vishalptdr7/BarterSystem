import { Router } from "express";
const messageRouter=Router();
import {upload} from "../middlewares/multer.js"
import { sendMessage,deleteMessage,getMessagesInChat } from "../controllers/message.js";
import { verifyJWT } from "../middlewares/auth.js";


messageRouter.route("/").post(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 10,
    },
  ]),
  sendMessage
);

messageRouter.route("/chat/:chat_id").get(verifyJWT, getMessagesInChat);

messageRouter.route("/:message_id").delete(verifyJWT, deleteMessage);



export {messageRouter};