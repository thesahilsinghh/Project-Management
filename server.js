import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

dotenv.config({});
connectDB();

const app = express();


// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.use("/api", router);

const PORT = process.env.PORT || 4999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));