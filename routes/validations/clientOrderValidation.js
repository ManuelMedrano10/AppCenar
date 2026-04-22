import { body, param } from "express-validator";

export const validateGetClientAddress = [
    body("clientAddressId")
        .trim()
        .notEmpty()
        .withMessage("Client address ID is required")
        .isMongoId()
        .withMessage("Invalid client address type ID format")
        .escape(),
];
