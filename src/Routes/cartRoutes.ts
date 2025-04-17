import { createCart, updateCart, deleteCart, getCart, getCarts } from "../Controller/cartController";
import express from "express";
import { cartValidator } from "../utils/validator/cartValidator";

const router = express.Router();

router.post('/create', cartValidator, createCart);
router.put('/update/:id', cartValidator, updateCart);
router.delete('/delete/:id', deleteCart);
router.get('/get/:id', getCart);
router.get('/all', getCarts);

export default router;