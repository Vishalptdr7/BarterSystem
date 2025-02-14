import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();


app.use(
  cors({
    origin: "http://your-frontend-domain.com", // Replace with your frontend domain
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
export {app};