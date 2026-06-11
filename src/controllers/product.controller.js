import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency, category, gender, quantity } = req.body;
    const seller = req.user

    const images = await Promise.all(req.files.map(async(file)=>{
        return await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname
        })
    }))


    const product = await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency || "INR"
        },
        category: category || 'Other',
        gender: gender || 'Unisex',
        quantity: quantity || 1,
        images,
        seller:seller._id
    })

    res.status(201).json({
        message:"Product created successfully",
        success:true,
        product
    })
}


export async function getSellerProducts(req,res){
    const seller = req.user;

    const products = await productModel.find({seller:seller._id})

    res.status(200).json({
        message:"products fetched successfully",
        success:true,
        products
    })
}


export async function getAllProducts(req,res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalProducts = await productModel.countDocuments();
    const products = await productModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message:"Product fetched successfully",
        success:true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    })
}


export async function getProductDetail(req,res) {
    const {id} = req.params
    const product = await productModel.findById(id)


    if(!product){
        return res.status(404).json({
            message:"product not found",
            success:false
        })
    }
    return res.status(200).json({
        message : "product found successfully",
        success:true,
        product
        
    })
}

export async function updateProduct(req, res) {
    const { id } = req.params;
    const seller = req.user;

    const product = await productModel.findOne({
        _id: id,
        seller: seller._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found or unauthorized",
            success: false
        });
    }

    const { title, description, priceAmount, priceCurrency, category, gender, quantity } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (priceAmount) product.price.amount = priceAmount;
    if (priceCurrency) product.price.currency = priceCurrency;
    if (category) product.category = category;
    if (gender) product.gender = gender;
    if (quantity !== undefined) product.quantity = quantity;

    // Handle image upload if new images are provided
    if (req.files && req.files.length > 0) {
        const images = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
        }));
        product.images = images;
    }

    await product.save();

    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        product
    });
}

export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = [];
    if (files || files.length !== 0) {
        (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }

    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")

    console.log(price)

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}

// New: Get products by category
export async function getProductsByCategory(req, res) {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalProducts = await productModel.countDocuments({ 
        category: { $regex: new RegExp(`^${category}$`, 'i') } 
    });
    const products = await productModel.find({ 
        category: { $regex: new RegExp(`^${category}$`, 'i') } 
    })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    });
}

// New: Get products by gender
export async function getProductsByGender(req, res) {
    const { gender } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalProducts = await productModel.countDocuments({ 
        gender: { $regex: new RegExp(`^${gender}$`, 'i') } 
    });
    const products = await productModel.find({ 
        gender: { $regex: new RegExp(`^${gender}$`, 'i') } 
    })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    });
}

// New: Search products with regex
export async function searchProducts(req, res) {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(keyword, 'i');

    const totalProducts = await productModel.countDocuments({
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
        ]
    });

    const products = await productModel.find({
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
        ]
    })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Search results fetched successfully",
        success: true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    });
}

// New: Filter products
export async function filterProducts(req, res) {
    const { category, gender, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Build filter object dynamically
    const filter = {};

    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (gender) {
        filter.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    if (minPrice || maxPrice) {
        filter['price.amount'] = {};
        if (minPrice) filter['price.amount'].$gte = Number(minPrice);
        if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
    }

    const totalProducts = await productModel.countDocuments(filter);
    const products = await productModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Filtered products fetched successfully",
        success: true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    });
}