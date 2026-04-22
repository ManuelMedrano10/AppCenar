import { body, param } from "express-validator";

export const validateGetEditConfiguration = [
    param("ConfigurationId")
    .trim()
    .notEmpty()
    .withMessage("Configuration ID is required")
    .isMongoId()
    .withMessage("Invalid configuration ID format")
    .escape(),
];

export const validatePostEditConfiguration = [
    body("ITBIS").notEmpty().withMessage("ITBIS value is required.").isNumeric().withMessage("ITBIS must be Numeric.").escape()
];