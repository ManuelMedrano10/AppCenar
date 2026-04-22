import express from "express";
import { GetDeliveryIndex, DeliveryActivation } from "../../controllers/admin/AdminDeliveriesController.js";
import {
    validateDeliveryActivation
} from "../validations/adminDeliveriesValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetDeliveryIndex);

router.post(
    "/activation", 
    isAuth, 
    validateDeliveryActivation, 
    handleValidationErrors("/deliveries/index"), 
    DeliveryActivation
);

export default router;