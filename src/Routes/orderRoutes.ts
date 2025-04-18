import { createOrder, updateStatusOrder, getOrder, deleteOrder, updateAddressOrder, getOrders, getOrderHistory, exportOrders } from "../Controller/orderController";
import { Router } from "express";

const router = Router();

router.post("/create", createOrder);
router.put("/update/:id", updateStatusOrder);
router.put("/updateAddress/:id", updateAddressOrder);
router.get("/get/:id", getOrder);
router.get("/all", getOrders);
router.get("/orderHistory/:userId", getOrderHistory);
router.get("/Orders/data", exportOrders);
router.delete("/delete/:id", deleteOrder);

export default router;