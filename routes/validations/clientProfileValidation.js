import { body, param } from "express-validator";

export const validateGetEditClient = [
    param("ClientId")
    .trim()
    .notEmpty()
    .withMessage("Client ID is required")
    .isMongoId()
    .withMessage("Invalid client ID format")
    .escape(),
];

export const validatePostEditClient = [
    body("Name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("Lastname").trim().notEmpty().withMessage("Description is required.").escape(),
    body("Phone").trim().notEmpty().withMessage("Phone is required.").escape()
];