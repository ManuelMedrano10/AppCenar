import { validationResult } from "express-validator";
import fs from "fs";

export function handleValidationErrors(redirectUrl) {
    return (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const errorMessages = errors.array().map((err) => err.msg);
            req.flash("errors", errorMessages);

            const finalUrl = typeof redirectUrl === "function" ? redirectUrl(req) : redirectUrl;

            return res.redirect(finalUrl);
        }
        return next();
    };
}