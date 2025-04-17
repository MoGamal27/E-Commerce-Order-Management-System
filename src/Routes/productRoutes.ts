import { createProduct, updateProduct, deleteProduct, getProduct, getProducts } from "../Controller/productController";
import express from "express";
import { productValidator } from "../utils/validator/productValidator";

const router = express.Router();

router.post('/create', productValidator, createProduct);
router.put('/update/:id', productValidator, updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get/:id', getProduct);
router.get('/all', getProducts);

export default router;