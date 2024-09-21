import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import { User } from "../models/user.js";

const authentication = async (req, res, next) => {
  const token = req.cookies["DMUM-token"];
  if (!token)
    return next({
      status: 401,
      message:
        "Vous devez être connecté à votre compte utilisateur pour effectuer cette opération.",
    });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const existingUser = await User.findById(decoded["_id"], {}, {});
    if (existingUser) {
      req["_id"] = decoded["_id"];
      next();
    } else
      return next({
        status: 404,
        message: "Ce compte n'existe pas.",
      });
  } catch (err) {
    console.error(err);
    return next({
      status: 401,
      message: "Vous n'êtes pas autorisé à effectuer cette opération",
    });
  }
};

export { authentication };
