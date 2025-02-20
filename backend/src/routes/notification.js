import { Router } from "express";
const notificationRouter=Router();
import { sendNotification,deleteNotification, getUserNotifications,markNotificationAsRead} from "../controllers/notification.js";
import { verifyJWT } from "../middlewares/auth.js";

notificationRouter.route("/").post(verifyJWT,sendNotification);

notificationRouter.route("/:notification_id").delete(verifyJWT,deleteNotification);

notificationRouter.route("/user/:user_id").get(verifyJWT,getUserNotifications);

notificationRouter.route("/:notification_id").put(verifyJWT,markNotificationAsRead);



export {notificationRouter};




