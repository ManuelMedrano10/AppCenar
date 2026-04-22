import { body, param } from "express-validator";

export const validatePostCreateCommerceType = [
    body("Name").trim().notEmpty().withMessage("Commerce Type name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Commerce Type description is required.").escape(),
    body("Icon").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Icon file is required");
        }
        return true;
    }),
];

export const validateGetEditCommerceType = [
    param("CommerceTypeId")
    .trim()
    .notEmpty()
    .withMessage("Commerce type ID is required")
    .isMongoId()
    .withMessage("Invalid commerce type ID format")
    .escape(),
];

export const validatePostEditCommerceType = [
    body("Name").trim().notEmpty().withMessage("Commerce Type name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Commerce Type description is required.").escape(),
];

export const validateDeleteCommerceType = [
    body("CommerceTypeId")
    .trim()
    .notEmpty()
    .withMessage("Commerce type ID is required")
    .isMongoId()
    .withMessage("Invalid commerce type ID format")
    .escape(),
];