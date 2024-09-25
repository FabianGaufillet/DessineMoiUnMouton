import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
    });

    const existingUser = await User.findOne(
      { email },
      { _id: 0, email: 1 },
      { lean: true },
    );
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message:
          "Ce compte existe déjà, veuillez vous connecter avec les identifiants renseignés lors de votre inscription pour continuer.",
      });
    }
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        _id: savedUser["_doc"]["_id"],
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );
    res.cookie("DMUM-token", token, { httpOnly: true });
    res.cookie("DMUM-authenticated", true);

    delete savedUser["_doc"]["role"];
    return res.status(200).json({
      status: "success",
      data: savedUser["_doc"],
      message: "Merci pour votre inscription ! Votre compte a bien été créé.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: [],
      message: "Erreur interne au serveur. Veuillez réessayer ultérieurement.",
    });
  }
};

export { signup };
