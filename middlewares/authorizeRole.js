import Roles from "../utils/enums/Roles.js";

export const authorizeRole = (allowRoles) => {
    return (req, res, next) => {
        if(!req.session || !req.session.user) {
            return res.redirect("/");
        }

        const userRole = req.session.user.role;

        if(allowRoles.includes(userRole)){
            return next();
        }

        if (userRole === Roles.CLIENT) {
            return res.redirect("/client-home/home");
        } 
        if (userRole === Roles.DELIVERY) {
            return res.redirect("/deliveriy-home/home");
        } 
        if (userRole === Roles.COMMERCE) {
            return res.redirect("/commerce-home/home");
        } 
        if (userRole === Roles.ADMIN) {
            return res.redirect("/dashboard/index");
        } 

        return res.redirect("/");
    };
};