import { signUp, login } from "../Controller/authController";
import { signupValidator, signinValidator} from "../utils/validator/authValidator";
import express from "express";
const router = express.Router();

router.post("/signup", signupValidator ,signUp);
router.post("/login", signinValidator ,login);


export default router;