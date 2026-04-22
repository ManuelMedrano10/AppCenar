import { body, param } from "express-validator";

export const validateGetEditDelivery = [
    param("DeliveryId")
    .trim()
    .notEmpty()
    .withMessage("Delivery ID is required")
    .isMongoId()
    .withMessage("Invalid delivery ID format")
    .escape(),
];

export const validatePostEditDelivery = [
    body("Name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("Lastname").trim().notEmpty().withMessage("Description is required.").escape(),
    body("Phone").trim().notEmpty().withMessage("Phone is required.").escape()
];