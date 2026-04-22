import express from "express";
import { GetClientsIndex, ClientActivation } from "../../controllers/admin/AdminClientsController.js";
import {
    validateClientActivation
} from "../validations/adminClientsValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetClientsIndex);

router.post(
    "/activation", 
    isAuth, 
    validateClientActivation, 
    handleValidationErrors("/clients/index"), 
    ClientActivation
);

export default router;