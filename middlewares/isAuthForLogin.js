import Users from "../models/UserModel.js";
import Roles from "../utils/enums/Roles.js";

export default function isAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        const user = Users.findOne({ _id: req.session.user._id })
        
        if (user.role === Roles.CLIENT) {
            return res.redirect("/client-home/home");
        } else if (user.role === Roles.DELIVERY) {
            return res.redirect("/delivery-home/home");
        } else if (user.role === Roles.COMMERCE) {
            return res.redirect("/commerce-home/home");
        } else if (user.role === Roles.ADMIN){
            return res.redirect("/dashboard/index");
        }
    }
    next();
}