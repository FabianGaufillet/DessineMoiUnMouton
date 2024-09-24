import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, "Veuillez renseigner le statut actuel de la partie."],
      enum: ["waiting", "inProgress", "closed"],
      default: "waiting",
    },
    drawer: {
      type: String,
      default: "",
    },
    word: {
      type: String,
      default: "",
    },
    players: {
      type: [String],
      required: [true, "Veuillez renseigner la liste des participants"],
    },
    winners: {
      type: [String],
    },
  },
  { timestamps: true },
);

const Game = mongoose.model("Game", GameSchema);

export { Game };
