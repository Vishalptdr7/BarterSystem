import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import dbconnect from "./db/index.js";

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser({}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



server.listen(process.env.PORT, () => {
  console.log(`Socket Server is running on port ${process.env.PORT}`);
  dbconnect()
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Routes
import userRouter from "./routes/user.js";
import skillRouter from "./routes/skill.js";
import user_skillsRouter from "./routes/user_skills.js";
import { swapRouter } from "./routes/swap.js";
import { reviewRouter } from "./routes/review.js";
import { messageRouter } from "./routes/message.js";
import { readMessageRouter } from "./routes/readMessage.js";
import { notificationRouter } from "./routes/notification.js";

app.use("/api/users", userRouter);
app.use("/api/skill", skillRouter);
app.use("/api/user_skill", user_skillsRouter);
app.use("/api/swap", swapRouter);
app.use("/api/review", reviewRouter);
app.use("/api/message", messageRouter);
app.use("/api/read_message", readMessageRouter);
app.use("/api/notification", notificationRouter);

export { app };
