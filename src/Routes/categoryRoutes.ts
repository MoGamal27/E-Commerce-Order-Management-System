import { createCategory, UpdateCategory } from "../Controller/categoryController";
import express from "express";
import  { categoryValidator }  from "../utils/validator/categoryValidator";
const router = express.Router();

router.post('/create', categoryValidator, createCategory);
router.put('/update/:id', categoryValidator, UpdateCategory);

export default router;