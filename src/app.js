import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser({

}));
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
import userRouter from "./routes/user.js";

app.use("/api/users", userRouter);

export {app};