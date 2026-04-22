import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productPhoto: {
        type: String,
        required: false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
},
{
    timestamps: true,
    collection: "Products"
});

const Products = mongoose.model("Products", productSchema);

export default Products;