import express from "express";
import { GetIndex, GetCreate, PostCreate, GetEdit, PostEdit, Delete } from "../../controllers/admin/CommerceTypesController.js";
import {
    validatePostCreateCommerceType,
    validateGetEditCommerceType,
    validatePostEditCommerceType,
    validateDeleteCommerceType,
} from "../validations/commerceTypeValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import upload from "../../middlewares/uploadImages.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetIndex);

router.get("/create", isAuth, authorizeRole([Roles.ADMIN]), GetCreate);
router.post(
    "/create", 
    isAuth,
    upload.single("Icon"),
    validatePostCreateCommerceType, 
    handleValidationErrors("/commerce-types/create"),
    PostCreate
);

router.get("/edit/:CommerceTypeId", isAuth, authorizeRole([Roles.ADMIN]), validateGetEditCommerceType, handleValidationErrors("/commerce-types/index"), GetEdit);
router.post(
    "/edit",
    isAuth,
    upload.single("Icon"),
    validatePostEditCommerceType,
    handleValidationErrors((req) => `/commerce-types/edit/${req.body.CommerceTypeId}`),
    PostEdit
);

router.post(
    "/delete",
    isAuth,
    validateDeleteCommerceType,
    handleValidationErrors("/commerce-types/index"),
    Delete
);

export default router;