import { User } from "../models/user.js";

const users = async (req, res) => {
  const existingUsers = await User.find(
    {},
    { _id: 0, first_name: 1, last_name: 1, points: 1, playing_time: 1 },
    {},
  ).sort({ points: -1 });
  return res
    .status(200)
    .json({ status: "success", data: existingUsers, message: "" });
};

export { users };
