import { body, param } from "express-validator";

export const validateAddFavorite = [
    body("CommerceId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape()
];

export const validateRemoveFavorite = [
    body("CommerceId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape()
];

export const validateDelete = [
    body("FavoritedId")
        .trim()
        .notEmpty()
        .withMessage("Commerce ID is required")
        .isMongoId()
        .withMessage("Invalid commerce ID format")
        .escape()
]