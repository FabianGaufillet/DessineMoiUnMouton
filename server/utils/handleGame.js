import { Game } from "../models/game.js";

const stopGame = async () => {
  const game = await Game.findOne({ status: "inProgress" }, {}, {});
  if (!game) return false;
  game["status"] = "closed";
  await game.save();
  return true;
};

export { stopGame };
