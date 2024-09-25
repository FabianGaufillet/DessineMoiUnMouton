import { checkWord, joinGame, launchGame, leaveGame } from "./handleGame.js";

const handleMessage = async (data) => {
  const commands = ["/d", "/j", "/q", "/w"];
  const chatMessage = data["chatMessage"];
  const user = data["user"];
  const chatCommand = commands.find((el) => chatMessage.startsWith(el));

  if (!chatCommand) return formatMessage(chatMessage, user);

  if (chatMessage.startsWith("/d")) {
    const word = chatMessage.split(" ")[1]?.toLowerCase();
    if (!word) return formatMessage(chatMessage, user);
    return await launchGame(user, word);
  }

  if (chatMessage.startsWith("/w")) {
    const word = chatMessage.split(" ")[1]?.toLowerCase();
    if (!word) return formatMessage(chatMessage, user);
    return await checkWord(user, word);
  }

  if (chatMessage.startsWith("/j")) return joinGame(user);

  if (chatMessage.startsWith("/q")) return leaveGame(user);
};

const formatMessage = (chatMessage, user) => {
  return {
    message: `${user["first_name"]} ${user["last_name"][0]}. : ${chatMessage}`,
    class: "user",
  };
};

export { handleMessage };
