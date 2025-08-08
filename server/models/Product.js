import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true },
    description: {type: Array, required: true},
    price: {type: Number, required: true },
    offerPrice: {type: Number, required: true },
    image: {type: Array, required: true },
    category: {type: String, required: true },
    inStock: {type: Boolean, default: true },
    stock: {type: Number, default: 100}, // Changed default from 0 to 100
    timesInCart: {type: Number, default: 0}, // New field
}, { timestamps: true})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product;