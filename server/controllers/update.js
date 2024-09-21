import { User } from "../models/user.js";

const update = async (req, res) => {
  const _id = req["_id"];
  const { first_name, last_name, email, password } = req.body;

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
    delete updatedUser["_doc"]["role"];
    delete updatedUser["_doc"]["password"];
    return res.status(200).json({
      status: "success",
      data: updatedUser["_doc"],
      message: "Vos modifications ont bien été prises en compte.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: [],
      message: "Une erreur s'est produite lors de la mise à jour.",
    });
  }
};

export { update };
