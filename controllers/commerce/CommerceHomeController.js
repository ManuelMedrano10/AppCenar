import mongoose from "mongoose";
import Orders from "../../models/OrdersModel.js";
import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import Status from "../../utils/enums/OrdersStatus.js";
import DeliveryStatus from "../../utils/enums/DeliveryStatus.js";

export async function GetCommerceHome(req, res) {
    try {
        const commerceId = req.session.user._id
        const orders = await Orders.aggregate([
            {
                $match: { commerceId: new mongoose.Types.ObjectId(commerceId) }
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

        res.render("commerce/home/home", {
            layout: "commerce-layout",
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

        const order = await Orders.findOne({ _id: id, commerceId: req.user._id }).populate("productId").populate("commerceId").lean();

        if (!order) {
            return res.redirect("/commerce-home/home");
        }

        const isOrderPending = order.status === Status.PENDING;

        let deliveriesAvailable = [];
        if (isOrderPending) {
            deliveriesAvailable = await Users.find({
                role: Roles.DELIVERY,
                deliveryStatus: DeliveryStatus.AVAILABLE
            }).lean();
        }

        res.render("commerce/home/detail", {
            order,
            isOrderPending,
            deliveriesAvailable,
            hasDeliveriesAvailable: deliveriesAvailable.length > 0,
            layout: "commerce-layout",
            "page-title": "Order Details"
        });

    } catch (err) {
        req.flash("errors", "Error fetching order.");
        console.error("Error fetching order:", err);
    }
}

export async function AssignDelivery(req, res) {
    try {
        const { OrderId, DeliveryId } = req.body;

        await Orders.findByIdAndUpdate(OrderId, {
            deliveryId: DeliveryId,
            status: Status.IN_PROCRESS
        });

        await Users.findByIdAndUpdate(DeliveryId, {
            deliveryStatus: DeliveryStatus.OCCUPIED
        });

        req.flash("success", "Delivery assigned successfully.");
        return res.redirect("/commerce-home/home");
    } catch (err) {
        req.flash("errors", "Error fetching deliveries.");
        console.error("Error fetching deliveries:", err);
    }
}