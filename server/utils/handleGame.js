import { Game } from "../models/game.js";
import { User } from "../models/user.js";

const gameDuration = 180 * 1000;

const launchGame = async (user, word) => {
  let games = await Game.find(
    { status: { $in: ["waiting", "inProgress"] } },
    {},
    {},
  );
  if (!games || !games.filter((el) => el["status"] === "waiting").length)
    return {
      message: "Aucun participant actuellement pour la prochaine partie.",
      class: "bot",
    };
  for (let i = 0; i < games.length; i++) {
    if (
      games[i]["status"] === "inProgress" &&
      games[i]["expiration_time"] < Date.now()
    ) {
      games[i]["status"] = "closed";
      await games[i].save();
    }
  }
  if (games.filter((el) => el["status"] === "inProgress").length)
    return {
      message:
        "Une partie est déjà en cours, vous ne pouvez pas en lancer une autre pour le moment",
      class: "bot",
    };
  const game = games.find((el) => "waiting" === el["status"]);
  const index = game["players"].indexOf(user["_id"]);
  if (index !== -1) game["players"].splice(index, 1);
  if (!game["players"].length)
    return {
      message: "Aucun participant actuellement pour la prochaine partie.",
      class: "bot",
    };
  Object.assign(game, {
    status: "inProgress",
    drawer: user["_id"],
    expiration_time: Date.now() + gameDuration,
    word,
  });
  await game.save();
  return {
    message: `Nouvelle partie lancée par ${user["first_name"]} ${user["last_name"]} !`,
    class: "bot",
    action: "launchGame",
  };
};

const joinGame = async (user) => {
  const game = await Game.findOne({ status: "waiting" }, {}, {});
  if (!game) {
    const newGame = new Game({
      status: "waiting",
      players: [user["_id"]],
    });
    await newGame.save();
  } else {
    const index = game["players"].indexOf(user["_id"]);
    if (index === -1) {
      game["players"].push(user["_id"]);
      await game.save();
    }
  }
  return {
    message: `${user["first_name"]} ${user["last_name"]} participe à la prochaine partie !`,
    class: "bot",
  };
};

const checkWord = async (user, word) => {
  const game = await Game.findOne(
    { status: "inProgress", players: { $elemMatch: { $eq: user["_id"] } } },
    {},
    {},
  );
  if (!game)
    return {
      message: `${user["first_name"]} ${user["last_name"]} : vous ne participez à aucune partie !`,
      class: "bot",
    };
  if (word === game["word"] && !game["winners"].includes(user["_id"])) {
    const points = Math.max(9 - game["winners"].length, 1);
    const existingUser = await User.findOne({ _id: user["_id"] }, {}, {});
    let action = "";
    existingUser["points"] += points;
    existingUser["playing_time"] += Math.round(
      (gameDuration - (game["expiration_time"] - Date.now())) / 1000,
    );
    game["winners"].push(user["_id"]);
    if (game["winners"].length === game["players"].length) action = "stopGame";
    await existingUser.save();
    await game.save();
    return {
      message: `${user["first_name"]} ${user["last_name"]} a trouvé le bon mot, il remporte ${points} points !`,
      class: "bot",
      action: action,
    };
  } else
    return {
      message: `${user["first_name"]} ${user["last_name"]} a proposé ${word}`,
      class: "bot",
    };
};

const leaveGame = async (user) => {
  const game = await Game.findOne(
    { status: "waiting", players: { $elemMatch: { $eq: user["_id"] } } },
    {},
    {},
  );
  if (game) {
    const index = game["players"].indexOf(user["_id"]);
    if (index !== -1) game["players"].splice(index, 1);
    await game.save();
  }
  return {
    message: `${user["first_name"]} ${user["last_name"]} ne participera pas à la prochaine partie.`,
    class: "bot",
  };
};

const stopGame = async () => {
  const game = await Game.findOne({ status: "inProgress" }, {}, {});
  if (!game) return false;
  game["status"] = "closed";
  await game.save();
  return true;
};

export { launchGame, joinGame, checkWord, leaveGame, stopGame };
