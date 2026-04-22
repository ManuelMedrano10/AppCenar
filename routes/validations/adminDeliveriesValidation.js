import { body } from "express-validator";

export const validateDeliveryActivation = [
  body("DeliveryId")
    .trim()
    .notEmpty()
    .withMessage("Delivery ID is required")
    .isMongoId()
    .withMessage("Invalid delivery ID format")
    .escape(),
];