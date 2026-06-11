import { body, query, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "validation error", errors: errors.array() })
    }

    next()
}

export const createProductValidator = [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("priceAmount").notEmpty().withMessage("price amount is required").isNumeric().withMessage("price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("price currency is required"),
    body("category").notEmpty().withMessage("category is required").isIn(['Shirts', 'Shoes', 'Watches', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Other']).withMessage("Invalid category"),
    body("gender").notEmpty().withMessage("gender is required").isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage("Invalid gender"),
    body("quantity").notEmpty().withMessage("quantity is required").isNumeric().withMessage("quantity must be a number").isInt({ min: 0 }).withMessage("quantity must be a non-negative integer"),
    validateRequest
]

export const updateProductValidator = [
    body("title").optional().notEmpty().withMessage("title cannot be empty"),
    body("description").optional().notEmpty().withMessage("description cannot be empty"),
    body("priceAmount").optional().isNumeric().withMessage("price amount must be a number"),
    body("category").optional().isIn(['Shirts', 'Shoes', 'Watches', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Other']).withMessage("Invalid category"),
    body("gender").optional().isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage("Invalid gender"),
    body("quantity").optional().isNumeric().withMessage("quantity must be a number").isInt({ min: 0 }).withMessage("quantity must be a non-negative integer"),
    validateRequest
]

export const categoryValidator = [
    param("category").notEmpty().withMessage("category is required"),
    validateRequest
]

export const genderValidator = [
    param("gender").notEmpty().withMessage("gender is required").isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage("Invalid gender"),
    validateRequest
]

export const searchValidator = [
    query("keyword").notEmpty().withMessage("keyword is required for search"),
    validateRequest
]

export const filterValidator = [
    query("category").optional().notEmpty().withMessage("category cannot be empty"),
    query("gender").optional().isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage("Invalid gender"),
    query("minPrice").optional().isNumeric().withMessage("minPrice must be a number"),
    query("maxPrice").optional().isNumeric().withMessage("maxPrice must be a number"),
    validateRequest
]