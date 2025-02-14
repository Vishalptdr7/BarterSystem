import {
  startChat,
  getUserChats,
  getChatDetails,
  deleteChat,
} from "../controllers/chat.js";
import { verifyJWT } from "../middlewares/auth.js";
import { Router } from "express";
const chatRouter = Router();

chatRouter.route("/").post(verifyJWT, startChat);
chatRouter.route("/user/:user_id").get(verifyJWT, getUserChats);
chatRouter.route("/:chat_id").get(verifyJWT, getChatDetails);
chatRouter.route("/:chat_id").delete(verifyJWT, deleteChat);

export default chatRouter;
