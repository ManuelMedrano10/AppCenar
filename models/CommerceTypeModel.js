import mongoose from "mongoose";

const commerceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Icon: {
        type: String,
        required: true
    },
},
{
    timestamps: true,
    collection: "CommerceTypes"
});

const CommerceTypes = mongoose.model("CommerceTypes", commerceTypeSchema);

export default CommerceTypes;