import mongoose from 'mongoose'
import priceSchema from './price.schema.js'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    // New fields for enhanced product management
    category: {
        type: String,
        required: true,
        enum: ['Shirts', 'Shoes', 'Watches', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Other'],
        default: 'Other'
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex', 'Kids'],
        default: 'Unisex'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
               
            }
        }
    ]
}, { timestamps: true })


const productModel = mongoose.model('product', productSchema)

export default productModel