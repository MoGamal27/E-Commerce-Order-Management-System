import { createCart, updateCart, deleteCart, getCart, getCarts } from "../Controller/cartController";
import express from "express";
import { cartValidator } from "../utils/validator/cartValidator";
import verifyToken from "../middleware/verifyToken";
import verifyRole from "../middleware/verifyRole";

const router = express.Router();

router.post('/create', cartValidator, verifyToken, createCart);
router.put('/update/:id', cartValidator, verifyToken, updateCart);
router.delete('/delete/:id', verifyToken, deleteCart);
router.get('/get/:id', verifyToken, getCart);
router.get('/all', verifyToken, verifyRole("ADMIN"), getCarts);

export default router;