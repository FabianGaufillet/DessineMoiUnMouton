import express from "express";
import { validate } from "../middlewares/validate.js";
import { register } from "../controllers/register.js";
import { update } from "../controllers/update.js";
import { userRegistrationValidator } from "../validators/userRegistrationValidator.js";

const router = express.Router();

/* TODO :
    - créer une route get qui retourne les informations liées à un utilisateur,
    - créer une route post pour s'authentifier,
    - créer une route delete pour supprimer le compte d'un utilisateur.
*/
router.post("/register", ...userRegistrationValidator, validate, register);
router.put("/update", ...userRegistrationValidator, validate, update);

export { router };
