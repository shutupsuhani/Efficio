import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/auth.js"; 
import {taskRouter} from "./routes/task.js"

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend's URL
  credentials: true,              // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

// Routes
app.use("/api/auth", userRouter); 
app.use("/api/file/",taskRouter);

// Database connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MYURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
    res.send("Welcome to the Task Management App API");
});

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};


(async () => {
  await connectToDB();
  startServer();
})();
