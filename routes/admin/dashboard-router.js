import express from "express"
import { GetDashboard } from "../../controllers/admin/AdminDashboardController.js";
import isAuth from "../../middlewares/isAuthForLogin.js";
import Roles from "../../utils/enums/Roles.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/index", isAuth, authorizeRole([Roles.ADMIN]), GetDashboard);

export default router;