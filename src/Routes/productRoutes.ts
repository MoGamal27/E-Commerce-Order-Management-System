import { createProduct, updateProduct, deleteProduct, getProduct, getProducts, getFilteredProducts } from "../Controller/productController";
import verifyToken from "../middleware/verifyToken";
import verifyRole from "../middleware/verifyRole";
import express from "express";
import { productValidator } from "../utils/validator/productValidator";

const router = express.Router();

router.post('/create', productValidator, verifyToken, verifyRole("ADMIN"), createProduct);
router.put('/update/:id', productValidator, updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get/:id', getProduct);
router.get('/all', getProducts);
router.get('/filter', getFilteredProducts);

export default router;