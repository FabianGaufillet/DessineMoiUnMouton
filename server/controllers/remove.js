import { User } from "../models/user.js";

const remove = async (req, res) => {
  const _id = req.query["_id"]?.trim();
  if (!_id) {
    return res.status(422).json({
      status: "failed",
      data: [],
      message: "Argument invalide, la requête n'a pas pu aboutir.",
    });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(_id, {});
    if (!deletedUser) {
      return res.status(404).json({
        status: "failed",
        data: [],
        message: "Cet utilisateur n'existe pas.",
      });
    }
    res.clearCookie("DMUM-token", { httpOnly: true });
    return res.status(200).json({
      status: "success",
      data: [],
      message: "Compte supprimé avec succès.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: [],
      message: "Une erreur s'est produite lors de la suppression du compte.",
    });
  }
};

export { remove };
