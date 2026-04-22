import { body, param } from "express-validator";

export const validatePostCreateProduct = [
    body("Name").trim().notEmpty().withMessage("Product name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Product description is required.").escape(),
    body("Price").trim().notEmpty().withMessage("Product price is required.").isNumeric().withMessage("Price must be numeric.").escape(),
    body("ProductPhoto").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Product photo file is required");
        }
        return true;
    }),
    body("CategoryId").trim().notEmpty().withMessage("Category ID is required").isMongoId().withMessage("Invalid category ID format").escape(),
];

export const validateGetEditProduct = [
    param("ProductId")
        .trim()
        .notEmpty()
        .withMessage("Product type ID is required")
        .isMongoId()
        .withMessage("Invalid product type ID format")
        .escape(),
];

export const validatePostEditProduct = [
    body("Name").trim().notEmpty().withMessage("Commerce Type name is required.").escape(),
    body("Description").trim().notEmpty().withMessage("Commerce Type description is required.").escape(),
    body("Price").trim().notEmpty().withMessage("Product price is required.").isNumeric().withMessage("Price must be numeric.").escape(),
    body("CategoryId").trim().notEmpty().withMessage("Category ID is required").isMongoId().withMessage("Invalid category ID format").escape(),
];

export const validateDeleteProduct = [
    body("ProductId")
        .trim()
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product type ID format")
        .escape(),
];