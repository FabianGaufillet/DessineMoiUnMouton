import express from "express";
import { validate } from "../middlewares/validate.js";
import { authentication } from "../middlewares/authentication.js";
import { signup } from "../controllers/signup.js";
import { update } from "../controllers/update.js";
import { users } from "../controllers/users.js";
import { signin } from "../controllers/signin.js";
import { userSignUpValidator } from "../validators/userSignUpValidator.js";

const router = express.Router();

/* TODO :
    - créer une route delete pour supprimer le compte d'un utilisateur.
*/
router.get("/", authentication, users);
router.post("/signup", ...userSignUpValidator, validate, signup);
router.post("/signin", signin);
router.put("/update", authentication, ...userSignUpValidator, validate, update);

export { router };
