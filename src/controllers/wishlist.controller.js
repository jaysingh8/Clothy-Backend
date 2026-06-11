import wishlistModel from '../models/wishlist.model.js'

export const getWishlist = async (req, res) => {
    const wishlist = await wishlistModel.findOne({ user: req.user._id })
        .populate('items.product')

    if (!wishlist) {
        return res.status(200).json({
            message: "Wishlist fetched successfully",
            success: true,
            wishlist: { items: [] }
        })
    }

    return res.status(200).json({
        message: "Wishlist fetched successfully",
        success: true,
        wishlist
    })
}

export const addToWishlist = async (req, res) => {
    const { productId } = req.params
    const { variantId } = req.body || {}

    let wishlist = await wishlistModel.findOne({ user: req.user._id })

    if (!wishlist) {
        wishlist = await wishlistModel.create({
            user: req.user._id,
            items: []
        })
    }

    // Check if product already in wishlist
    const isAlreadyInWishlist = wishlist.items.some(
        item => item.product.toString() === productId &&
            (item.variant?.toString() === variantId || (!item.variant && !variantId))
    )

    if (isAlreadyInWishlist) {
        return res.status(400).json({
            message: "Product already in wishlist",
            success: false
        })
    }

    const newItem = { product: productId }
    if (variantId) newItem.variant = variantId

    wishlist.items.push(newItem)
    await wishlist.save()
    await wishlist.populate('items.product')

    return res.status(200).json({
        message: "Product added to wishlist",
        success: true,
        wishlist
    })
}

export const removeFromWishlist = async (req, res) => {
    const { productId } = req.params
    const variantId = req.query.variantId

    const wishlist = await wishlistModel.findOne({ user: req.user._id })

    if (!wishlist) {
        return res.status(404).json({
            message: "Wishlist not found",
            success: false
        })
    }

    const pullQuery = { product: productId }
    if (variantId) pullQuery.variant = variantId

    wishlist.items = wishlist.items.filter(item => {
        if (item.product.toString() !== productId) return true
        if (variantId && item.variant?.toString() !== variantId) return true
        if (!variantId && item.variant) return true
        return false
    })

    await wishlist.save()

    return res.status(200).json({
        message: "Product removed from wishlist",
        success: true,
        wishlist
    })
}

export const toggleWishlist = async (req, res) => {
    const { productId } = req.params
    const { variantId } = req.body || {}

    let wishlist = await wishlistModel.findOne({ user: req.user._id })

    if (!wishlist) {
        wishlist = await wishlistModel.create({
            user: req.user._id,
            items: []
        })
    }

    const existingIndex = wishlist.items.findIndex(
        item => item.product.toString() === productId &&
            (item.variant?.toString() === variantId || (!item.variant && !variantId))
    )

    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlist.items.splice(existingIndex, 1)
        await wishlist.save()
        await wishlist.populate('items.product')
        return res.status(200).json({
            message: "Product removed from wishlist",
            success: true,
            wishlist,
            isWishlisted: false
        })
    } else {
        // Add to wishlist
        const newItem = { product: productId }
        if (variantId) newItem.variant = variantId
        wishlist.items.push(newItem)
        await wishlist.save()
        await wishlist.populate('items.product')
        return res.status(200).json({
            message: "Product added to wishlist",
            success: true,
            wishlist,
            isWishlisted: true
        })
    }
}

export const checkWishlist = async (req, res) => {
    const { productId } = req.params

    const wishlist = await wishlistModel.findOne({ user: req.user._id })

    if (!wishlist) {
        return res.status(200).json({
            success: true,
            isWishlisted: false
        })
    }

    const isWishlisted = wishlist.items.some(item => item.product.toString() === productId)

    return res.status(200).json({
        success: true,
        isWishlisted
    })
}