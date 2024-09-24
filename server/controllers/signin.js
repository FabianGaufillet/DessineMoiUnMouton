import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

const signin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }, {}, {}).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Vos identifiants de connexion ne correspondent à aucun compte sur notre système.",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body["password"],
      user["password"],
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Vos identifiants de connexion ne correspondent à aucun compte sur notre système.",
      });
    }
    delete user["_doc"]["password"];
    const token = jwt.sign(
      {
        _id: user["_doc"]["_id"],
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );
    res.cookie("DMUM-token", token, { httpOnly: true });
    res.cookie("DMUM-authenticated", true);
    return res.status(200).json({
      status: "success",
      data: user["_doc"],
      message: "Connexion réussie ! Contents de vous revoir parmi nous.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: [],
      message: "Erreur interne. Veuillez réessayer ultérieurement.",
    });
  }
};
export { signin };
