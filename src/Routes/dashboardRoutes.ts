import { Router } from 'express';
import { 
  getTotalRevenue, 
  getTotalOrders, 
  getRecentOrders, 
  getTopProducts 
} from '../Controller/dashboardController';
import verifyToken from '../middleware/verifyToken';
import verifyRole from '../middleware/verifyRole'


const router = Router();

//router.use(verifyToken, verifyRole('ADMIN'));

router.get('/revenue', getTotalRevenue);
router.get('/orders/total', getTotalOrders);
router.get('/orders/recent', getRecentOrders);
router.get('/products/top', getTopProducts);

export default router;
