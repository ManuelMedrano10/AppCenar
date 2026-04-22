import express from "express";
import { GetCommercesIndex, CommerceActivation } from "../../controllers/admin/AdminCommercesController.js";
import {
    validateCommerceActivation
} from "../validations/adminCommercesValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetCommercesIndex);

router.post(
    "/activation", 
    isAuth, 
    validateCommerceActivation, 
    handleValidationErrors("/commerces/index"), 
    CommerceActivation
);

export default router;