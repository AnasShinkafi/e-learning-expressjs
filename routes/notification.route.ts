import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.';
import { getNotification, updateNotification } from '../controllers/notification.controller';
import { updateAccessToken } from '../controllers/user.controller';

const notificationRoute = express.Router();

notificationRoute.get("/get-all-notifications", authorizeRoles("admin"), updateAccessToken, isAuthenticated, getNotification);

notificationRoute.put("/update-notification/:id", authorizeRoles("admin"), updateAccessToken, isAuthenticated, updateNotification);


export default notificationRoute;