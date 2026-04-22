import express from "express";
import { GetIndex, GetCreate, PostCreate, GetEdit, PostEdit, Delete } from "../../controllers/client/ClientAddressController.js";
import {
    validatePostCreateAddress,
    validateGetEditAddress,
    validatePostEditAddress,
    validateDeleteAddress
} from "../validations/clientAddressValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.CLIENT]), GetIndex);

router.get("/create", isAuth, authorizeRole([Roles.CLIENT]), GetCreate);
router.post(
    "/create", 
    isAuth,
    validatePostCreateAddress, 
    handleValidationErrors("/addresses/create"),
    PostCreate
);

router.get(
    "/edit/:AddressId", 
    isAuth, 
    authorizeRole([Roles.CLIENT]), 
    validateGetEditAddress, 
    handleValidationErrors("/addresses/index"), 
    GetEdit
);
router.post(
    "/edit",
    isAuth,
    validatePostEditAddress,
    handleValidationErrors((req) => `/addresses/edit/${req.body.AddressId}`),
    PostEdit
);

router.post(
    "/delete",
    isAuth,
    validateDeleteAddress,
    handleValidationErrors("/addresses/index"),
    Delete
);

export default router;