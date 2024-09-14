import { User } from "../models/user.js";

const register = async (req, res) => {
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
    const { role, ...user_data } = savedUser._doc;
    res.status(200).json({
      status: "success",
      data: user_data,
      message:
        "Merci pour votre inscription ! Votre compte a bien été créé. Vous pouvez désormais vous connecter avec vos identifiants.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Erreur interne. Veuillez réessayer ultérieurement.",
    });
  }
  res.end();
};

export { register };
