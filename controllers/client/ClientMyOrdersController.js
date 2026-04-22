import mongoose from "mongoose";
import Orders from "../../models/OrdersModel.js";
import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import Status from "../../utils/enums/OrdersStatus.js";
import DeliveryStatus from "../../utils/enums/DeliveryStatus.js";

export async function GetClientOrders(req, res) {
    try {
        const clientId = req.session.user._id
        const orders = await Orders.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(clientId) }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productsDetails"
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "commerceId",
                    foreignField: "_id",
                    as: "commerceInfo"
                }
            },
            {
                $unwind: {
                    path: "$commerceInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    productsQuantity: { $size: "$productId" }
                }
            }
        ]);

        res.render("clients/orders/index", {
            layout: "client-layout",
            ordersList: orders,
            hasOrders: orders.length > 0,
            "page-title": "My Orders"
        });

    } catch (err) {
        req.flash("errors", "Error fetching orders.");
        console.error("Error fetching orders:", err);
    }
}

export async function GetOrderDetail(req, res) {
    try {
        const id = req.params.OrderId;

        const order = await Orders.findOne({ _id: id, userId: req.user._id })
        .populate("productId")
        .populate("commerceId")
        .lean();

        if (!order) {
            return res.redirect("/client-my-orders/index");
        }

        res.render("clients/orders/detail", {
            order,
            layout: "client-layout",
            "page-title": "Order Details"
        });

    } catch (err) {
        req.flash("errors", "Error fetching order.");
        console.error("Error fetching order:", err);
    }
}