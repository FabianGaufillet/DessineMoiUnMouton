import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import { User } from "../models/user.js";

const authentication = async (req, res, next) => {
  const authHeader = req.headers["cookie"],
    { _id } = req.body;
  if (!authHeader)
    return next({
      status: 401,
      message:
        "Vous devez être connecté à votre compte utilisateur pour effectuer cette opération.",
    });
  const cookie = authHeader.split("=").at(-1);
  let decoded;
  try {
    decoded = jwt.verify(cookie, JWT_SECRET);
    const existingUser = await User.findById(decoded["_id"], {}, {});
    if (
      (existingUser && _id === decoded["_id"]) ||
      "ADMINISTRATOR" === existingUser["role"]
    )
      next();
    else
      return next({
        status: 401,
        message: "Vous n'êtes pas autorisé à effectuer cette opération",
      });
  } catch (err) {
    console.error(err);
    return next({
      status: 401,
      message:
        "Une erreur s'est produite lors de votre authentification. Veuillez réessayer plus tard.",
    });
  }
};

export { authentication };
