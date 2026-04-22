import express from "express";
import { GetIndex, GetEdit, PostEdit } from "../../controllers/admin/ConfigurationController.js";
import { validateGetEditConfiguration, validatePostEditConfiguration } from "../validations/configurationValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetIndex);

router.get(
    "/edit/:ConfigurationId",
    isAuth,
    authorizeRole([Roles.ADMIN]),
    validateGetEditConfiguration,
    handleValidationErrors("/configuration/index"),
    GetEdit
);
router.post(
    "/edit",
    isAuth,
    validatePostEditConfiguration,
    handleValidationErrors((req) => `/configuration/edit/${req.body.ConfigurationId}`),
    PostEdit
);

export default router;