import { body } from "express-validator";

export const validateClientActivation = [
  body("ClientId")
    .trim()
    .notEmpty()
    .withMessage("Client ID is required")
    .isMongoId()
    .withMessage("Invalid client ID format")
    .escape(),
];