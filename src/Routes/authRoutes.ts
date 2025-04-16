import { signUp } from "../Controller/authController";
import { signupValidator} from "../utils/validator/authValidator";
import express from "express";
const router = express.Router();

router.post("/signup", signupValidator ,signUp);


export default router;