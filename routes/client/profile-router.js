import express from "express";
import { GetProfile, GetEdit, PostEdit } from "../../controllers/client/ClientProfileController.js";
import { validateGetEditClient, validatePostEditClient } from "../validations/clientProfileValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import upload from "../../middlewares/uploadImages.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.CLIENT]), GetProfile);

router.get(
    "/edit/:ClientId", 
    isAuth, 
    authorizeRole([Roles.CLIENT]), 
    validateGetEditClient, 
    handleValidationErrors("/client-profile/index"), 
    GetEdit
);
router.post(
    "/edit",
    isAuth,
    upload.single("Photo"),
    validatePostEditClient,
    handleValidationErrors((req) => `/client-profile/edit/${req.body.ClientId}`),
    PostEdit
);

export default router;