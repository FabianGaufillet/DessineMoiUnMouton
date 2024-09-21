import { body } from "express-validator";

const userSignUpValidator = [
  body("email")
    .isEmail()
    .withMessage("Veuillez renseigner une adresse mail valide")
    .normalizeEmail(),
  body("first_name")
    .notEmpty()
    .withMessage("Veuillez renseigner votre prénom")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Veuillez renseigner votre prénom")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .withMessage(
      "Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial",
    ),
];

export { userSignUpValidator };
