import { body, param } from "express-validator";

export const validateGetEditCommerce = [
    param("CommerceId")
    .trim()
    .notEmpty()
    .withMessage("Commerce ID is required")
    .isMongoId()
    .withMessage("Invalid commerce ID format")
    .escape(),
];

export const validatePostEditCommerce = [
    body("OpeningHour").trim().notEmpty().withMessage("Opening hour is required.").escape(),
    body("ClosingHour").trim().notEmpty().withMessage("Closing Hour hour is required.").escape(),
    body("Phone").trim().notEmpty().withMessage("Commerce Type description is required.").escape(),
    body("Email").trim().isEmail().withMessage("Invalid email format.").notEmpty().withMessage("Email is required.").escape(),
];