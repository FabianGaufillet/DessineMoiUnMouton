import { User } from "../models/user.js";

const update = async (req, res) => {
  const { _id, first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ _id }, {}, {});
    if (!existingUser) {
      return res.status(404).json({
        status: "failed",
        data: [],
        message: "Ce compte n'existe pas.",
      });
    }
    Object.assign(existingUser, { first_name, last_name, email, password });
    const updatedUser = await existingUser.save();
    const { role, ...user_data } = updatedUser._doc;
    res.status(200).json({
      status: "success",
      data: user_data,
      message: "Vos modifications ont bien été prises en compte.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: "error",
        data: [],
        message: "Une erreur s'est produite lors de la mise à jour.",
      });
  }
  res.end();
};

export { update };
