import express from "express";
import { GetIndex, GetCreate, PostCreate, GetEdit, PostEdit, Delete } from "../../controllers/commerce/CategoriesController.js";
import {
    validatePostCreateCategory,
    validateGetEditCategory,
    validatePostEditCategory,
    validateDeleteCategory
} from "../validations/categoriesValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.COMMERCE]), GetIndex);

router.get("/create", isAuth, authorizeRole([Roles.COMMERCE]), GetCreate);
router.post(
    "/create", 
    isAuth,
    validatePostCreateCategory, 
    handleValidationErrors("/categories/create"),
    PostCreate
);

router.get("/edit/:CategoryId", isAuth, authorizeRole([Roles.COMMERCE]), validateGetEditCategory, handleValidationErrors("/categories/index"), GetEdit);
router.post(
    "/edit",
    isAuth,
    validatePostEditCategory,
    handleValidationErrors((req) => `/categories/edit/${req.body.CategoryId}`),
    PostEdit
);

router.post(
    "/delete",
    isAuth,
    validateDeleteCategory,
    handleValidationErrors("/categories/index"),
    Delete
);

export default router;