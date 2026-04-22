import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
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
    collection: "Categories"
});

const Categories = mongoose.model("Categories", categorySchema);

export default Categories;