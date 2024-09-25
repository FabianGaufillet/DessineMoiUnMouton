import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { URL, SERVER_PORT, MONGODB_URI } from "./config/index.js";
import { router as user } from "./routes/user.js";
import { handleMessage } from "./utils/handleMessage.js";
import { stopGame } from "./utils/handleGame.js";

const app = express();

app.use(cors({ origin: URL, credentials: true }));
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
    cors: { origin: URL },
  });
  const gameDuration = 180;
  let remainingTime = gameDuration;
  let intervalID = null;

  const onChat = async (data) => {
    const result = await handleMessage(data);
    if (result.action === "launchGame" && !intervalID) {
      remainingTime = gameDuration;
      intervalID = setInterval(async () => {
        io.emit("remainingTime", --remainingTime);
        if (remainingTime === 0) {
          clearInterval(intervalID);
          intervalID = null;
          await stopGame();
          io.emit("chat", {
            message: "Partie terminée les loulous. Merci aux participants !",
            class: "bot",
          });
        }
      }, 1000);
    } else if (result.action === "stopGame") {
      clearInterval(intervalID);
      intervalID = null;
      remainingTime = 0;
      await stopGame();
      io.emit("remainingTime", remainingTime);
      io.emit("chat", {
        message: "Partie terminée les loulous. Merci aux participants !",
        class: "bot",
      });
    }
    io.emit("chat", {
      message: result.message,
      class: result.class,
    });
  };

  io.on("connection", (socket) => {
    socket.on("chat", async (data) => onChat(data));
    socket.on("draw", (data) => io.emit("draw", data));
  });
})();
