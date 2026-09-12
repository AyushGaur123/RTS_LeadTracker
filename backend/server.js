import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

import {notFound,errorHandler,} from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({

    origin:[
        "http://localhost:5173",
       process.env.CLIENT_URL,
      ],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


/*
  Health check
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LeadFlow API is running 🚀",
  });
});


/*
  API routes
*/
app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);


/*
  Error handling
*/
app.use(notFound);

app.use(errorHandler);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LeadFlow server running on port ${PORT}`);
});