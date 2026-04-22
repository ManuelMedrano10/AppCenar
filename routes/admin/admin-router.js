import express from "express";
import { GetIndex, GetCreate, PostCreate, GetEdit, PostEdit, AdminActivation } from "../../controllers/admin/AdminController.js";
import {
    validatePostCreateAdmins,
    validateGetEditAdmins,
    validatePostEditAdmins,
    validateAdminActivation
} from "../validations/adminValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetIndex);

router.get("/create", isAuth, authorizeRole([Roles.ADMIN]), GetCreate);
router.post("/create", isAuth, validatePostCreateAdmins, handleValidationErrors("/admins/create"), PostCreate);

router.get("/edit/:AdminId", isAuth, authorizeRole([Roles.ADMIN]), validateGetEditAdmins, handleValidationErrors("/admins/index"), GetEdit);
router.post(
    "/edit", 
    isAuth, 
    validatePostEditAdmins, 
    handleValidationErrors((req) => `/admins/edit/${req.body.AdminId}`), 
    PostEdit
);

router.post(
    "/activation", 
    isAuth, 
    validateAdminActivation, 
    handleValidationErrors("/admins/index"), 
    AdminActivation
);

export default router;