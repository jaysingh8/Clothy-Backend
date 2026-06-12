import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import userModel from '../models/user.model.js'

export const authenticateUser = async (req, res, next) => {
    // Read token from Authorization header (Bearer <token>) OR cookie as fallback
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "No token" })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: err.message })
    }
}

export const authenticateSeller = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden" })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: err.message || "Unauthorized" })
    }
}