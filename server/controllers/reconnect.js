import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import { User } from "../models/user.js";

const reconnect = async (req, res) => {
  const token = req.cookies["DMUM-token"];
  if (!token)
    return res.status(401).json({
      status: "failed",
      data: [],
      message: "Un token est requis pour cette opération.",
    });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const existingUser = await User.findById(decoded["_id"], {}, {});
    if (existingUser) {
      delete existingUser["_doc"]["password"];
      return res.status(200).json({
        status: "success",
        data: existingUser,
        message: "Connexion réussie ! Contents de vous revoir parmi nous.",
      });
    } else {
      res.clearCookie("DMUM-token", { httpOnly: true });
      res.clearCookie("DMUM-authenticated");
      return res.status(404).json({
        status: "failed",
        data: [],
        message: "Cet utilisateur n'existe pas",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: [],
      message: "Erreur interne. Veuillez réessayer ultérieurement.",
    });
  }
};

export { reconnect };
