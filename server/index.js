import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { SERVER_PORT, MONGODB_URI } from "./config/index.js";
import { router as user } from "./routes/user.js";
import { handleMessage } from "./utils/handleMessage.js";
import { stopGame } from "./utils/handleGame.js";

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let remainingTime = 300;
let intervalID = null;

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI);

    app.use("/api/user", user);

    app.use((error, req, res, next) => {
      res.status(error.status).json(error.message);
    });

    return app.listen({ port: SERVER_PORT }, () => {
      console.log(`Server started on port ${SERVER_PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  const server = await start();
  const io = new Server(server, {
    cors: { origin: "http://localhost:4200" },
  });
  io.on("connection", (socket) => {
    socket.on("chat", async (data) => {
      const message = await handleMessage(data);
      if (message.startsWith("Nouvelle") && !intervalID) {
        intervalID = setInterval(async () => {
          io.emit("remainingTime", --remainingTime);
          if (remainingTime === 0) {
            clearInterval(intervalID);
            remainingTime = 300;
            await stopGame();
            io.emit("chat", "Partie terminée les loulous");
          }
        }, 1000);
      }
      io.emit("chat", message);
    });
    socket.on("draw", (data) => io.emit("draw", data));
  });
})();
