import { Router } from "express";
import  authRoutes  from "./authRoutes";
import categoryRoutes from "./categoryRoutes"
import productRoutes from "./productRoutes"
import cartRoutes from "./cartRoutes"
import orderRoutes from "./orderRoutes"
import paymentRoutes from "./paymentRoutes"
const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes)
router.use("/cart", cartRoutes)
router.use("/order", orderRoutes)
router.use("/payment", paymentRoutes)


export default router;