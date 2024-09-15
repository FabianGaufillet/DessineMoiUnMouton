import express from "express";
import { validate } from "../middlewares/validate.js";
import { authentication } from "../middlewares/authentication.js";
import { register } from "../controllers/register.js";
import { update } from "../controllers/update.js";
import { users } from "../controllers/users.js";
import { userRegistrationValidator } from "../validators/userRegistrationValidator.js";

const router = express.Router();

/* TODO :
    - créer une route post pour s'authentifier,
    - créer une route delete pour supprimer le compte d'un utilisateur.
*/
router.get("/", authentication, users);
router.post("/register", ...userRegistrationValidator, validate, register);
router.put(
  "/update",
  authentication,
  ...userRegistrationValidator,
  validate,
  update,
);

export { router };
