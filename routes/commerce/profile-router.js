import express from "express";
import { GetProfile, GetEdit, PostEdit } from "../../controllers/commerce/CommerceProfileController.js";
import { validateGetEditCommerce, validatePostEditCommerce } from "../validations/commerceProfileValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import upload from "../../middlewares/uploadImages.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.COMMERCE]), GetProfile);

router.get(
    "/edit/:CommerceId", 
    isAuth, 
    authorizeRole([Roles.COMMERCE]), 
    validateGetEditCommerce, 
    handleValidationErrors("/commerce-profile/index"), 
    GetEdit
);
router.post(
    "/edit",
    isAuth,
    upload.single("Logo"),
    validatePostEditCommerce,
    handleValidationErrors((req) => `/commerce-profile/edit/${req.body.CommerceId}`),
    PostEdit
);

export default router;