import { createCategory, UpdateCategory } from "../Controller/categoryController";
import express from "express";
import  { categoryValidator }  from "../utils/validator/categoryValidator";
import verifyToken from "../middleware/verifyToken";
import verifyRole from "../middleware/verifyRole";
const router = express.Router();

router.use(verifyToken, verifyRole("ADMIN"));

router.post('/create', categoryValidator, createCategory);
router.put('/update/:id', categoryValidator, UpdateCategory);

export default router;