import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SERVER_PORT, MONGODB_URI } from "./config/index.js";
import { router as user } from "./routes/user.js";

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI);

    app.use("/api/user", user);

    app.use((error, req, res, next) => {
      res.status(error.status).json(error.message);
    });

    app.listen({ port: SERVER_PORT }, () => {
      console.log(`Server started on port ${SERVER_PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
