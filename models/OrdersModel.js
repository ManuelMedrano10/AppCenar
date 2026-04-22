import mongoose from "mongoose";
import OrderStatus from "../utils/enums/OrdersStatus.js";

const orderModel = new mongoose.Schema({
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    clientAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientsAddresses",
        required: true
    },
    commerceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dateTimeOrder: {
        type: Date,
        required: false
    },
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: false
    },
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false
    }
},
{
    timestamps: true,
    collection: "Orders"
});

const Orders = mongoose.model("Orders", orderModel);

export default Orders;