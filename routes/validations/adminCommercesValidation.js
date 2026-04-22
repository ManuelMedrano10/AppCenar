import { body } from "express-validator";

export const validateCommerceActivation = [
  body("CommerceId")
    .trim()
    .notEmpty()
    .withMessage("Commerce ID is required")
    .isMongoId()
    .withMessage("Invalid commerce ID format")
    .escape(),
];