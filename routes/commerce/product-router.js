import express from "express";
import { GetIndex, GetCreate, PostCreate, GetEdit, PostEdit, Delete } from "../../controllers/commerce/ProductsController.js";
import {
    validatePostCreateProduct,
    validateGetEditProduct,
    validatePostEditProduct,
    validateDeleteProduct,
} from "../validations/productValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import upload from "../../middlewares/uploadImages.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.COMMERCE]), GetIndex);

router.get("/create", isAuth, authorizeRole([Roles.COMMERCE]), GetCreate);
router.post(
    "/create", 
    isAuth,
    upload.single("ProductPhoto"),
    validatePostCreateProduct, 
    handleValidationErrors("/products/create"),
    PostCreate
);

router.get("/edit/:ProductId", isAuth, authorizeRole([Roles.COMMERCE]), validateGetEditProduct, handleValidationErrors("/products/index"), GetEdit);
router.post(
    "/edit",
    isAuth,
    upload.single("ProductPhoto"),
    validatePostEditProduct,
    handleValidationErrors((req) => `/products/edit/${req.body.ProductId}`),
    PostEdit
);

router.post(
    "/delete",
    isAuth,
    validateDeleteProduct,
    handleValidationErrors("/products/index"),
    Delete
);

export default router;