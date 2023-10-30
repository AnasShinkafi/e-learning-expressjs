import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.';
import { CreateOrder, getAllOrders, newPayment, sendStripePublishedKey } from '../controllers/order.controller';
import { updateAccessToken } from '../controllers/user.controller';

const orderRouter = express.Router();

orderRouter.post("create-order", isAuthenticated, CreateOrder);

orderRouter.get("get-orders", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllOrders);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishedKey );

orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;