import { body, param } from "express-validator";

export const validateGetOrderDetail = [
    param("OrderId")
        .trim()
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID format")
        .escape(),
];

export const validateAssingDelivery = [
    body("OrderId")
        .trim()
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID format")
        .escape(),
    body("DeliveryId")
        .trim()
        .notEmpty()
        .withMessage("Delivery ID is required")
        .isMongoId()
        .withMessage("Invalid delivery ID format")
        .escape(),
]