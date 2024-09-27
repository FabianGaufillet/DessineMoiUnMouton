import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { URL, SERVER_PORT, MONGODB_URI } from "./config/index.js";
import { router as user } from "./routes/user.js";
import { handleMessage } from "./utils/handleMessage.js";
import { stopGame } from "./utils/handleGame.js";
import * as path from "node:path";

const __dirname = import.meta.dirname;
const app = express();

app.use(cors({ origin: URL, credentials: true }));
app.use(
  express.static(
    path.join(__dirname, "/../dist/dessine-moi-un-mouton/browser"),
  ),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI);

    app.use("/api/user", user);

    app.get("*", (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          "/../dist/dessine-moi-un-mouton/browser/index.html",
        ),
      );
    });

    app.use((error, req, res, next) => {
      res.status(error.status).json(error);
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
  let drawer = null;

  const startNewGame = async (gameDrawer) => {
    remainingTime = gameDuration;
    drawer = gameDrawer;
    intervalID = setInterval(async () => {
      io.emit("remainingTime", remainingTime--);
      if (remainingTime === 0) {
        try {
          await stopCurrentGame();
        } catch (err) {
          console.error(err);
        }
      }
    }, 1000);
  };

  const stopCurrentGame = async () => {
    clearInterval(intervalID);
    drawer = null;
    intervalID = null;
    remainingTime = 0;
    try {
      await stopGame();
    } catch (err) {
      console.error(err);
    }
    io.emit("remainingTime", remainingTime);
    io.emit("chat", {
      message: "Partie terminée les loulous. Merci aux participants !",
      class: "bot",
    });
  };

  const onChat = async (data) => {
    try {
      const result = await handleMessage(data);
      if (result.action === "launchGame" && !intervalID) {
        await startNewGame(result.drawer);
      } else if (result.action === "stopGame") {
        await stopCurrentGame();
      }
      io.emit("chat", {
        message: result.message,
        class: result.class,
      });
    } catch (err) {
      console.error(err);
    }
  };

  io.on("connection", (socket) => {
    socket.on("chat", async (data) => onChat(data));
    socket.on("draw", (data) => {
      if (!drawer || data["user"]["_id"] === drawer) io.emit("draw", data);
    });
  });
})();
