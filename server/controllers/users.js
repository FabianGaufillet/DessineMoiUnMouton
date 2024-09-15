import { User } from "../models/user.js";

const users = async (req, res) => {
  const _id = req.query["_id"]?.trim();
  if (_id) {
    const existingUser = await User.findOne({ _id }, {}, {});
    if (!existingUser) {
      return res.status(404).json({
        status: "failed",
        data: {},
        message: "Cet utilisateur n'existe pas.",
      });
    }
    return res
      .status(200)
      .json({ status: "success", data: existingUser, message: "" });
  } else {
    const existingUsers = await User.find(
      {},
      { _id: 0, first_name: 1, last_name: 1 },
      {},
    );
    return res
      .status(200)
      .json({ status: "success", data: existingUsers, message: "" });
  }
};

export { users };
