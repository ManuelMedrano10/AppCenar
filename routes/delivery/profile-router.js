import express from "express";
import { GetProfile, GetEdit, PostEdit } from "../../controllers/delivery/DeliveryProfileController.js";
import { validateGetEditDelivery, validatePostEditDelivery } from "../validations/deliveryProfileValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import upload from "../../middlewares/uploadImages.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.DELIVERY]), GetProfile);

router.get(
    "/edit/:DeliveryId", 
    isAuth, 
    authorizeRole([Roles.DELIVERY]), 
    validateGetEditDelivery, 
    handleValidationErrors("/delivery-profile/index"), 
    GetEdit
);
router.post(
    "/edit",
    isAuth,
    upload.single("Photo"),
    validatePostEditDelivery,
    handleValidationErrors((req) => `/delivery-profile/edit/${req.body.DeliveryId}`),
    PostEdit
);

export default router;