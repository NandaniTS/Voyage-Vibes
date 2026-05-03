
import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import apiRouter from "./api/routes";


const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI || ""

const app = express();
const server = createServer(app);


app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3000",
  credentials: true,
}));

// Middleware to parse cookies
app.use(cookieParser());

// Serve static files from uploads directory


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Hello from Core Server`,
  });
});

app.use("/api", apiRouter);

app.use('/api/uploads', express.static('uploads'));


async function startServer() {
  try {
    const connectDB = await mongoose.connect(DATABASE_URI);
    console.log("Database Connected Successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server is up and running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();



