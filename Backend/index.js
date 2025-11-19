import express from "express";
import db from "./db/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
const allowedOrigin = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigin, credentials: true }));
//db_connection//
db();

// routes//
app.use("/user/api", authRoutes);
//globalErrorHandler//
app.use(globalErrorHandler);
app.listen(3000, () => {
  console.log("server started");
});
