import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    cedula: {
        type: String,
        required: false,
        trim: true
    },
    phone:{
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    photo: {
        type: String,
        required: false
    },
    username: {
        type: String,
        trim: true,
        required: false
    },
    role: {
        type: Number,
        required: true
    },
    openingHour: {
        type: String,
        required: false
    },
    closingHour: {
        type: String,
        required: false
    },
    commerceTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommerceTypes",
        required: false,
    },
    deliveryStatus: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiration: {
        type: Date,
        required: false
    },
    ActivationToken: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false,
        required: false
    },
},
{
    timestamps: true,
    collection: "Users"
});

const Users = mongoose.model("Users", userSchema);

export default Users;