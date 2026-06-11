import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { 
    addProductVariant, 
    createProduct, 
    getAllProducts, 
    getProductDetail, 
    getSellerProducts,
    updateProduct,
    getProductsByCategory,
    getProductsByGender,
    searchProducts,
    filterProducts
} from "../controllers/product.controller.js";
import multer from 'multer'
import {
    createProductValidator,
    updateProductValidator,
    categoryValidator,
    genderValidator,
    searchValidator,
    filterValidator
} from "../validators/products.validator.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

const router = Router()

// Create product (seller only)
router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

// Get seller products (seller only)
router.get("/seller", authenticateSeller, getSellerProducts)

// Get all products (public) - supports pagination: ?page=1&limit=15
router.get("/", getAllProducts)

// Search products (public) - ?keyword=searchterm
router.get("/search", searchValidator, searchProducts)

// Filter products (public) - ?category=Shirts&gender=Men&minPrice=100&maxPrice=1000
router.get("/filter", filterValidator, filterProducts)

// Get products by category (public) - /category/:category
router.get("/category/:category", categoryValidator, getProductsByCategory)

// Get products by gender (public) - /gender/:gender
router.get("/gender/:gender", genderValidator, getProductsByGender)

// Get single product detail (public)
router.get("/detail/:id", getProductDetail)

// Update product (seller only)
router.put("/:id", authenticateSeller, upload.array('images', 7), updateProductValidator, updateProduct)

// Add product variant (seller only)
router.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariant)



export default router