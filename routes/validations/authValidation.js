import { body, param } from "express-validator";

export const validatePostLogin = [
    body("Email").trim().isEmail().withMessage("Invalid email format").escape(),
    body("Password").trim().notEmpty().withMessage("Password is required").escape()
];

export const validatePostRegisterClientDelivery = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Lastname").trim().notEmpty().withMessage("Lastname is required").escape(),
    body("Phone").trim().notEmpty().withMessage("Phone is required").escape(),
    body("Email").trim().isEmail().withMessage("Invalid email format").escape(),
    body("Photo").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Photo file is required");
        }
        return true;
    }),
    body("Username").trim().notEmpty().withMessage("Username is required").escape(),
    body("Role").trim().notEmpty().withMessage("Role is required").escape(),
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

export const validatePostRegisterCommerce = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Phone").trim().notEmpty().withMessage("Phone is required").escape(),
    body("Email").trim().isEmail().withMessage("Invalid email format").escape(),
    body("Logo").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Logo file is required");
        }
        return true;
    }),
    body("OpeningHour").notEmpty().withMessage("Opening Hour is required")
        .isTime().withMessage("Invalid opening hour format").escape(),
    body("ClosingHour").notEmpty().withMessage("Closing Hour is required")
        .isTime().withMessage("Invalid opening hour format").escape(),
    body("CommerceTypeId").trim().notEmpty().withMessage("Commerce Type is required")
        .isMongoId().withMessage("Invalid Commerce Type ID format").escape(),
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
    body("ConfirmPassword").trim().notEmpty().withMessage("Confirm Password is required")
];

export const validateGetActivate = [
    param("token").trim().notEmpty().withMessage("Token is required.").escape()
];

export const validatePostForgot = [
    body("Email").trim().isEmail().withMessage("Invalid email format").notEmpty().withMessage("Email is required.").escape()
];

export const validateGetReset = [
    param("token").trim().notEmpty().withMessage("Token is required").escape(),
];

export const validatePostReset = [
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
    body("ConfirmPassword").trim().notEmpty().withMessage("Confirm Password is required"),
    body("UserId").trim().notEmpty().withMessage("User ID is required.").isMongoId().withMessage("Invalid User ID").escape(),
    body("PasswordToken").trim().notEmpty().withMessage("Password Token is required")
];