import mongoose from "mongoose";
import Orders from "../../models/OrdersModel.js";
import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import Status from "../../utils/enums/OrdersStatus.js";
import DeliveryStatus from "../../utils/enums/DeliveryStatus.js";

export async function GetDeliveryHome(req, res) {
    try {
        const deliveryId = req.session.user._id
        const orders = await Orders.aggregate([
            {
                $match: { deliveryId: new mongoose.Types.ObjectId(deliveryId) }
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

        res.render("delivery/home/home", {
            layout: "delivery-layout",
            ordersList: orders,
            hasOrders: orders.length > 0,
            "page-title": "Home"
        });

    } catch (err) {
        req.flash("errors", "Error fetching orders.");
        console.error("Error fetching orders:", err);
    }
}

export async function GetOrderDetail(req, res) {
    try {
        const id = req.params.OrderId;

        const order = await Orders.findOne({ _id: id, deliveryId: req.user._id })
        .populate("productId")
        .populate("commerceId")
        .populate("clientAddressId")
        .lean();

        if (!order) {
            return res.redirect("/delivery-home/home");
        }

        const isOrderInProcess = order.status === Status.IN_PROCRESS;

        res.render("delivery/home/detail", {
            order,
            isOrderInProcess,
            layout: "delivery-layout",
            "page-title": "Order Details"
        });

    } catch (err) {
        req.flash("errors", "Error fetching order.");
        console.error("Error fetching order:", err);
    }
}

export async function EndDelivery(req, res) {
    try {
        const { OrderId } = req.body;
        const id = req.user._id;

        await Orders.findByIdAndUpdate(OrderId, {
            status: Status.COMPLETED
        });

        await Users.findByIdAndUpdate(id, {
            deliveryStatus: DeliveryStatus.AVAILABLE
        });

        req.flash("success", "Delivery completed successfully.");
        return res.redirect("/delivery-home/home");
    } catch (err) {
        req.flash("errors", "Error fetching deliveries.");
        console.error("Error fetching deliveries:", err);
    }
}