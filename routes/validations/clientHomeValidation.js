import { body, param } from "express-validator";

export const validateGetCommerceList = [
    param("CommerceTypeId")
        .trim()
        .notEmpty()
        .withMessage("Commerce Type ID is required")
        .isMongoId()
        .withMessage("Invalid commerce type ID format")
        .escape(),
];

export const validateGetCommerceByName = [
    body("NameFilter").trim().escape()
];

export const validateGetCommerceCatalogue = [
    param("CommerceId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape(),
];

export const validateAddProductToKart = [
    body("ProductId")
        .trim()
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format")
        .escape(),
    body("CommerceId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape(),
];

export const validateRemoveProductFromKart = [
    body("ProductId")
        .trim()
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format")
        .escape(),
    body("CommerceId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape(),
];