import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app=express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain
    credentials: true, // This ensures cookies are sent with the request
  })
);
app.use(cookieParser({

}));
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
import userRouter from "./routes/user.js";

app.use("/api/users", userRouter);

import skillRouter from "./routes/skill.js";
import user_skillsRouter from "./routes/user_skills.js";

app.use("/api/skill",skillRouter);


app.use("/api/user_skill",user_skillsRouter)

import { swapRouter } from "./routes/swap.js";

app.use("/api/swap",swapRouter);


import { reviewRouter } from "./routes/review.js";

app.use("/api/review",reviewRouter);

import chatRouter from "./routes/chat.js";

app.use("/api/chat", chatRouter);


import { messageRouter } from "./routes/message.js";

app.use("/api/message", messageRouter);



import { readMessageRouter } from "./routes/readMessage.js";

app.use("/api/read_message", readMessageRouter);


import { notificationRouter } from "./routes/notification.js";

app.use("/api/notification", notificationRouter);
export {app};

