import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    checkWishlist
} from "../controllers/wishlist.controller.js";

const router = Router()

// All wishlist routes require authentication
router.use(authenticateUser)

// Get user's wishlist
router.get("/", getWishlist)

// Check if product is wishlisted
router.get("/check/:productId", checkWishlist)

// Toggle product in wishlist (add/remove)
router.post("/toggle/:productId", toggleWishlist)

// Add product to wishlist
router.post("/add/:productId", addToWishlist)

// Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist)

export default router