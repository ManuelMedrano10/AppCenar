import express from "express";
import isAuthForLogin from "../middlewares/isAuthForLogin.js";
import {
    GetLogin,
    GetRegisterClientDelivery,
    GetRegisterCommerce,
    PostRegisterClientDelivery,
    PostRegisterCommerce,
    Logout,
    GetForgot,
    PostForgot,
    GetReset,
    PostReset,
    GetActivate,
    PostLogin
} from "../controllers/AuthController.js";
import {
    validateGetActivate,
    validateGetReset,
    validatePostReset,
    validatePostForgot,
    validatePostLogin,
    validatePostRegisterClientDelivery,
    validatePostRegisterCommerce
} from "./validations/authValidation.js";
import { handleValidationErrors } from "../middlewares/handleValidation.js";
import upload from "../middlewares/uploadImages.js";

const router = express.Router();

router.get("/", isAuthForLogin, GetLogin);
router.post("/", isAuthForLogin, validatePostLogin, handleValidationErrors("/"), PostLogin);

router.get("/user/logout", Logout);

router.get("/user/register-client-delivery", isAuthForLogin, GetRegisterClientDelivery);
router.post(
    "/user/register-client-delivery", 
    isAuthForLogin, 
    upload.single("Photo"),
    validatePostRegisterClientDelivery,
    handleValidationErrors("/user/register-client-delivery"),
    PostRegisterClientDelivery
);
router.get("/user/register-commerce", isAuthForLogin, GetRegisterCommerce);
router.post(
    "/user/register-commerce", 
    isAuthForLogin, 
    upload.single("Logo"),
    validatePostRegisterCommerce,
    handleValidationErrors("/user/register-commerce"),
    PostRegisterCommerce
);

router.get("/user/forgot", isAuthForLogin, GetForgot);
router.post("/user/forgot", isAuthForLogin, validatePostForgot, handleValidationErrors("/user/forgot"), PostForgot);

router.get("/user/reset/:token", isAuthForLogin, validateGetReset, handleValidationErrors("/"), GetReset);
router.post(
    "/user/reset", 
    isAuthForLogin, 
    validatePostReset, 
    handleValidationErrors((req)=> `/user/reset/${req.body.PasswordToken}`),
    PostReset
);

router.get("/user/activate/:token", isAuthForLogin, validateGetActivate, handleValidationErrors("/"), GetActivate);

export default router;
