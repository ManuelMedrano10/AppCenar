import express from "express";
import { GetDeliveryHome, GetOrderDetail, EndDelivery } from "../../controllers/delivery/DeliveryHomeController.js";
import { validateEndDelivery, validateGetOrderDetail } from "../validations/deliveryHomeValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/home", isAuth, authorizeRole([Roles.DELIVERY]), GetDeliveryHome);

router.get("/detail/:OrderId", isAuth, authorizeRole([Roles.DELIVERY]), validateGetOrderDetail, handleValidationErrors("/delivery-home/home"), GetOrderDetail);
router.post("/end", isAuth, validateEndDelivery, handleValidationErrors("/delivery-home/home"), EndDelivery);

export default router;