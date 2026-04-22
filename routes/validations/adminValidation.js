import { body, param } from "express-validator";

export const validatePostCreateAdmins = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Lastname").trim().notEmpty().withMessage("Lastname is required").escape(),
    body("Cedula").trim().notEmpty().withMessage("Cedula is required").escape(),
    body("Email").trim().isEmail().withMessage("Invalid email format").escape(),
    body("Username").trim().notEmpty().withMessage("Username is required").escape(),
    body("Password").trim().notEmpty().withMessage("Password is required")
        .custom((value, { req }) => {
            if (value !== req.body.ConfirmPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }).isLength({ min: 10 }).withMessage("Password must be at least 10 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[\W_]/)
        .withMessage("Password must contain at least one special character"),
    body("ConfirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Confirm Password is required")
];

export const validateGetEditAdmins = [
    param("AdminId")
        .trim()
        .notEmpty()
        .withMessage("Admin ID is required")
        .isMongoId()
        .withMessage("Invalid admin ID format")
        .escape(),
];

export const validatePostEditAdmins = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Lastname").trim().notEmpty().withMessage("Lastname is required").escape(),
    body("Cedula").trim().notEmpty().withMessage("Cedula is required").escape(),
    body("Email").trim().isEmail().withMessage("Invalid email format").escape(),
    body("Username").trim().notEmpty().withMessage("Username is required").escape(),
    body("Password").notEmpty()
        .custom((value, { req }) => {
            if (value !== req.body.ConfirmPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }).isLength({ min: 10 }).withMessage("Password must be at least 10 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[\W_]/)
        .withMessage("Password must contain at least one special character"),
    body("ConfirmPassword")
        .trim(),
    body("AdminId")
        .trim()
        .notEmpty()
        .withMessage("Admin ID is required")
        .isMongoId()
        .withMessage("Invalid admin ID format")
        .escape(),
];

export const validateAdminActivation = [
  body("AdminId")
    .trim()
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admins ID format")
    .escape(),
];
