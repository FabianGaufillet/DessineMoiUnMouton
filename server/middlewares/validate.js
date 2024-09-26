import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message:
        "Formulaire invalide, veuillez vérifier que les champs sont correctement renseignés",
    });
  }
  next();
};

export { validate };
