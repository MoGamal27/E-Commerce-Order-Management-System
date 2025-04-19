import { createOrder, updateStatusOrder, getOrder, deleteOrder, updateAddressOrder, getOrders, getOrderHistory, exportOrders } from "../Controller/orderController";
import { Router } from "express";
import verifyToken from "../middleware/verifyToken";
import verifyRole from "../middleware/verifyRole";

const router = Router();

router.post("/create", verifyToken, createOrder);
router.put("/update/:id", verifyToken, verifyRole("ADMIN"), updateStatusOrder);
router.put("/updateAddress/:id", verifyToken,updateAddressOrder);
router.get("/get/:id", verifyToken, verifyRole("ADMIN"), getOrder);
router.get("/all", verifyToken, verifyRole("ADMIN"), getOrders);
router.get("/orderHistory/:userId", verifyToken, getOrderHistory);
router.get("/Orders/data", verifyToken, verifyRole("ADMIN"), exportOrders);
router.delete("/delete/:id", verifyToken, verifyRole("ADMIN"), deleteOrder);

export default router;