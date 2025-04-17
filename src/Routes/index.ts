import { Router } from "express";
import  authRoutes  from "./authRoutes";
import categoryRoutes from "./categoryRoutes"
const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);


export default router;