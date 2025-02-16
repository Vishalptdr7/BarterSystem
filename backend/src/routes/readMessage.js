import { Router } from "express";
import { read } from "fs";
import { verifyJWT } from "../middlewares/auth.js";
import { markMessageAsRead,getReadStatus } from "../controllers/readMessage.js";
const readMessageRouter=Router();

readMessageRouter.route("/:message_id/user/:user_id").put(verifyJWT,markMessageAsRead);

readMessageRouter.route("/:message_id").get(verifyJWT,getReadStatus);
export {readMessageRouter};