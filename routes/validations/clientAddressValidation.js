import { body, param } from "express-validator";

export const validatePostCreateAddress = [
    body("Name").trim().notEmpty().withMessage("Address name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Address description is required.").escape(),
];

export const validateGetEditAddress = [
    param("AddressId")
    .trim()
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID format")
    .escape(),
];

export const validatePostEditAddress = [
    body("Name").trim().notEmpty().withMessage("Address name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Address description is required.").escape(),
];

export const validateDeleteAddress = [
    body("AddressId")
    .trim()
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID format")
    .escape(),
];