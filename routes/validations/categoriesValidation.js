import { body, param } from "express-validator";

export const validatePostCreateCategory = [
    body("Name").trim().notEmpty().withMessage("Category name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Category description is required.").escape(),
];

export const validateGetEditCategory = [
    param("CategoryId")
    .trim()
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .escape(),
];

export const validatePostEditCategory = [
    body("Name").trim().notEmpty().withMessage("Category name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Category description is required.").escape(),
];

export const validateDeleteCategory = [
    body("CategoryId")
    .trim()
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .escape(),
];