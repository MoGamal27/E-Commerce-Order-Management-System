import { Router } from "express";
import  authRoutes  from "./authRoutes";
import categoryRoutes from "./categoryRoutes"
import productRoutes from "./productRoutes"
const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes)


export default router;