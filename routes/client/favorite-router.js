import express from "express";
import { GetIndex, AddFavorite, RemoveFavoriteInCommerceList, Delete } from "../../controllers/client/ClientFavoritesController.js";
import { validateAddFavorite, validateRemoveFavorite, validateDelete} from "../validations/clientFavoriteValidation.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import Roles from "../../utils/enums/Roles.js";
import { handleValidationErrors } from "../../middlewares/handleValidation.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.CLIENT]), GetIndex);

router.post(
    "/add-favorite",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateAddFavorite,
    handleValidationErrors((req) => `/client-home/home`),
    AddFavorite
);

router.post(
    "/remove-favorite",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateRemoveFavorite,
    handleValidationErrors((req) => `/client-home/home`),
    RemoveFavoriteInCommerceList
);

router.post(
    "/delete",
    isAuth,
    authorizeRole([Roles.CLIENT]),
    validateDelete,
    handleValidationErrors("/favorites/index"),
    Delete
);

export default router;