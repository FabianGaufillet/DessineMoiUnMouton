import express from "express";
import { validate } from "../middlewares/validate.js";
import { authentication } from "../middlewares/authentication.js";
import { signup } from "../controllers/signup.js";
import { update } from "../controllers/update.js";
import { users } from "../controllers/users.js";
import { signin } from "../controllers/signin.js";
import { logout } from "../controllers/logout.js";
import { remove } from "../controllers/remove.js";
import { userSignUpValidator } from "../validators/userSignUpValidator.js";

const router = express.Router();

router.get("/", authentication, users);
router.post("/signup", ...userSignUpValidator, validate, signup);
router.post("/signin", signin);
router.put("/update", authentication, ...userSignUpValidator, validate, update);
router.get("/logout", logout);
router.delete("/", authentication, remove);

export { router };
