import express  from "express";
import { getCourseAnalytics, getOrdersAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.";
import { updateAccessToken } from "../controllers/user.controller";

const analyticRoute = express.Router();

analyticRoute.get("/get-users-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getUserAnalytics);

analyticRoute.get("/get-orders-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getOrdersAnalytics);

analyticRoute.get("/get-courses-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);


export default analyticRoute;