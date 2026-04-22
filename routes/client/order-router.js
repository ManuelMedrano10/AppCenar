import express from "express";
import { GetCreate, PostCreate } from "../../controllers/client/ClientOrderController.js";
import { validateGetClientAddress } from "../validations/clientOrderValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import Roles from "../../utils/enums/Roles.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/create", isAuth, authorizeRole([Roles.CLIENT]), GetCreate);

router.post(
    "/create",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateGetClientAddress,
    handleValidationErrors("/client-order/create"),
    PostCreate
);

export default router;