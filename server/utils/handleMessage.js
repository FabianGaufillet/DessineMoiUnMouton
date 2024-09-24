import { Game } from "../models/game.js";

const handleMessage = async (data) => {
  const commands = ["/d", "/j", "/q", "/w"];
  const chatMessage = data["chatMessage"];
  const user = data["user"];

  if (!commands.some((el) => chatMessage.startsWith(el)))
    return formatMessage(chatMessage, user);

  if (chatMessage.startsWith("/d")) {
    const word = chatMessage.split(" ")[1]?.toLowerCase();
    if (!word) return formatMessage(chatMessage, user);
    return await launchGame(user, word);
  } else if (chatMessage.startsWith("/w")) {
    const word = chatMessage.split(" ")[1]?.toLowerCase();
    if (!word) return formatMessage(chatMessage, user);
    return await checkWord(user, word);
  } else if (chatMessage.startsWith("/j")) return joinGame(user);
  else if (chatMessage.startsWith("/q")) return leftGame(user);
};

const launchGame = async (user, word) => {
  const games = await Game.find(
    { status: { $in: ["waiting", "inProgress"] } },
    {},
    {},
  );
  if (!games) return "Aucun participant actuellement pour la prochaine partie.";
  if (games.filter((el) => el["status"] === "inProgress").length)
    return "Une partie est déjà en cours, vous ne pouvez pas en lancer une autre pour le moment";
  const game = games.find((el) => (el["status"] = "waiting"));
  const index = game["players"].indexOf(user["_id"]);
  if (index !== -1) game["players"].splice(index, 1);
  if (!game["players"].length)
    return "Aucun participant actuellement pour la prochaine partie.";
  Object.assign(game, { status: "inProgress", drawer: user["_id"], word });
  await game.save();
  return `Nouvelle partie lancée par ${user["first_name"]} ${user["last_name"]} !`;
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
  return `${user["first_name"]} ${user["last_name"]} participe à la prochaine partie !`;
};

const checkWord = async (user, word) => {
  const game = await Game.findOne(
    { status: "inProgress", players: { $elemMatch: { $eq: user["_id"] } } },
    {},
    {},
  );
  if (!game)
    return `${user["first_name"]} ${user["last_name"]} : vous ne participez à aucune partie !`;
  if (word === game["word"] && !game["winners"].includes(user["_id"])) {
    const points = Math.max(9 - game["winners"].length, 1);
    game["winners"].push(user["_id"]);
    await game.save();
    return `${user["first_name"]} ${user["last_name"]} a trouvé le bon mot, il remporte ${points} points !`;
  } else return `${user["first_name"]} ${user["last_name"]} a proposé ${word}`;
};

const leftGame = async (user) => {
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
  return `${user["first_name"]} ${user["last_name"]} ne participera pas à la prochaine partie.`;
};

const formatMessage = (chatMessage, user) => {
  return `${user["first_name"]} ${user["last_name"][0]}. : ${chatMessage}`;
};

export { handleMessage };
