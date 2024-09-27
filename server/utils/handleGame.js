import { Game } from "../models/game.js";
import { User } from "../models/user.js";

const gameDuration = 180;

/*
  Lancement de la partie si les conditions sont réunies
  - Une partie a le statut "waiting"
  - Une autre partie n'est pas déjà en cours
  - Il y a au moins un joueur autre que le dessinateur
*/
const launchGame = async (user, word) => {
  try {
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
        message: `@${user["first_name"]} ${user["last_name"]} : Une partie est déjà en cours, vous ne pouvez pas en lancer une autre pour le moment`,
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
      expiration_time: Date.now() + gameDuration * 1000,
      word,
    });
    await game.save();
    return {
      message: `Nouvelle partie lancée par @${user["first_name"]} ${user["last_name"]} !`,
      class: "bot",
      action: "launchGame",
      drawer: user["_id"],
    };
  } catch (err) {
    return {
      message:
        "Une erreur s'est produite, le dernier message n'a pas été pris en compte.",
      class: "bot",
    };
  }
};

/*
  Un joueur souhaite participer à la prochaine partie
  - Si elle n'existe pas encore, elle est créée
  - Sinon, il est ajouté à la liste des participants
*/
const joinGame = async (user) => {
  try {
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
      message: `@${user["first_name"]} ${user["last_name"]} participe à la prochaine partie !`,
      class: "bot",
    };
  } catch (err) {
    return {
      message:
        "Une erreur s'est produite, le dernier message n'a pas été pris en compte.",
      class: "bot",
    };
  }
};

/*
  Un joueur a proposé un mot. On lui attribue des points si :
  - il y a une partie en cours
  - il fait partie de la liste des participants à la partie en cours
  - le mot proposé correspond à celui recherché
  - il ne fait pas déjà partie de la liste des gagnants
*/
const checkWord = async (user, word) => {
  try {
    const game = await Game.findOne(
      { status: "inProgress", players: { $elemMatch: { $eq: user["_id"] } } },
      {},
      {},
    );
    if (!game)
      return {
        message: `@${user["first_name"]} ${user["last_name"]} : vous ne participez à aucune partie.`,
        class: "bot",
      };
    if (word === game["word"] && !game["winners"].includes(user["_id"])) {
      const remainingTime = (game["expiration_time"] - Date.now()) / 1000;
      const points = Math.round(remainingTime / 2);
      const player = await User.findOne({ _id: user["_id"] }, {}, {});
      const drawer = await User.findOne({ _id: game["drawer"] }, {}, {});
      let action = "";
      player["points"] += points;
      drawer["points"] += points;
      player["playing_time"] += Math.round(gameDuration - remainingTime);
      game["winners"].push(user["_id"]);
      if (game["winners"].length === game["players"].length)
        action = "stopGame";
      await player.save();
      await drawer.save();
      await game.save();
      return {
        message: `@${user["first_name"]} ${user["last_name"]} a trouvé le bon mot !`,
        class: "bot",
        action: action,
      };
    } else
      return {
        message: `@${user["first_name"]} ${user["last_name"]} a proposé ${word}`,
        class: "bot",
      };
  } catch (err) {
    return {
      message:
        "Une erreur s'est produite, le dernier message n'a pas été pris en compte.",
      class: "bot",
    };
  }
};

/*
  Désinscription d'un joueur
*/
const leaveGame = async (user) => {
  try {
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
      message: `@${user["first_name"]} ${user["last_name"]} ne participera pas à la prochaine partie.`,
      class: "bot",
    };
  } catch (err) {
    return {
      message:
        "Une erreur s'est produite, le dernier message n'a pas été pris en compte.",
      class: "bot",
    };
  }
};

/*
  Arrêt de la partie en cours
  - Soit tous les joueurs ont trouvé le mot
  - Soit le temps est écoulé
*/
const stopGame = async () => {
  try {
    const game = await Game.findOne({ status: "inProgress" }, {}, {});
    if (!game) return false;
    game["status"] = "closed";
    await game.save();
    return true;
  } catch (err) {
    return null;
  }
};

export { launchGame, joinGame, checkWord, leaveGame, stopGame };
