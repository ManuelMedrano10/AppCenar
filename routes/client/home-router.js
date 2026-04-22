import express from "express";
import { 
    GetClientHome, 
    GetCommerceByName, 
    GetCommerceCatalogue, 
    GetCommerceList, 
    AddProductToKart, 
    RemoveProductFromKart
} from "../../controllers/client/ClientHomeController.js";
import { 
    validateGetCommerceByName, 
    validateGetCommerceCatalogue, 
    validateGetCommerceList, 
    validateAddProductToKart, 
    validateRemoveProductFromKart
} from "../validations/clientHomeValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import Roles from "../../utils/enums/Roles.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/home", isAuth, authorizeRole([Roles.CLIENT]), GetClientHome);

router.get(
    "/commerce-list/:CommerceTypeId",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateGetCommerceList,
    handleValidationErrors("/client-home/home"),
    GetCommerceList
);

router.post(
    "/filter-by-name",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateGetCommerceByName,
    handleValidationErrors((req) => `/client-home/commerce-list/${req.body.CommerceTypeId}`),
    GetCommerceByName
);

router.get(
    "/commerce-catalogue/:CommerceId",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateGetCommerceCatalogue,
    handleValidationErrors((req) => `/client-home/home`),
    GetCommerceCatalogue
);

router.post(
    "/add-product",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateAddProductToKart,
    handleValidationErrors((req) => `/client-home/commerce-catalogue/${req.body.CommerceId}`),
    AddProductToKart
);

router.post(
    "/remove-product",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateRemoveProductFromKart,
    handleValidationErrors((req) => `/client-home/commerce-catalogue/${req.body.CommerceId}`),
    RemoveProductFromKart
);

export default router;