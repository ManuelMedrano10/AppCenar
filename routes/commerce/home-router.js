import express from "express";
import { GetCommerceHome, GetOrderDetail, AssignDelivery } from "../../controllers/commerce/CommerceHomeController.js";
import { validateAssingDelivery, validateGetOrderDetail } from "../validations/commerceHomeValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/home", isAuth, authorizeRole([Roles.COMMERCE]), GetCommerceHome);

router.get("/detail/:OrderId", isAuth, authorizeRole([Roles.COMMERCE]), validateGetOrderDetail, handleValidationErrors("/commerce-home/home"), GetOrderDetail);
router.post("/assign", isAuth, validateAssingDelivery, handleValidationErrors("/commerce-home/home"), AssignDelivery);

export default router;