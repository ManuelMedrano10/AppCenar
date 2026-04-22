import express from "express";
import { GetClientOrders, GetOrderDetail } from "../../controllers/client/ClientMyOrdersController.js";
import { validateGetOrderDetail } from "../validations/clientMyOrdersValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.CLIENT]), GetClientOrders);

router.get("/detail/:OrderId", isAuth, authorizeRole([Roles.CLIENT]), validateGetOrderDetail, handleValidationErrors("/client-my-orders/index"), GetOrderDetail);

export default router;