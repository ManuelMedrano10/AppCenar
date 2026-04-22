import { param } from "express-validator";

export const validateGetOrderDetail = [
    param("OrderId")
        .trim()
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID format")
        .escape(),
];
