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
import { reconnect } from "../controllers/reconnect.js";

const router = express.Router();

router.get("/", users);
router.post("/signup", ...userSignUpValidator, validate, signup);
router.post("/signin", signin);
router.post("/reconnect", reconnect);
router.put("/update", authentication, ...userSignUpValidator, validate, update);
router.post("/logout", logout);
router.delete("/", authentication, remove);

export { router };
