import { body } from "express-validator";

const userRegistrationValidator = [
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
    .isLength({ min: 8 })
    .withMessage(
      "Votre mot de passe doit avoir une longueur minimale de 8 caractères",
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
    ),
];

export { userRegistrationValidator };
