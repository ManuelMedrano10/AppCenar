import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import OrderModels from "../../models/OrdersModel.js";

export async function GetDeliveryIndex(req, res, next) {
    try {
        const deliveries = await Users.aggregate([
            {
                $match: { role: Roles.DELIVERY }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Orders",
                    localField: "_id",
                    foreignField: "deliveryId",
                    as: "ordersAmount"
                }
            },
            {
                $addFields: {
                    orderDeliveredQuantity: { $size: "$ordersAmount" }
                }
            },
            {
                $project: {
                    ordersAmount: 0
                }
            }
        ]);

        res.render("admin/deliveries/index", {
            deliveriesList: deliveries,
            hasDeliveries: deliveries.length > 0,
            "page-title": "Deliveries list"
        });
    } catch (err) {
        req.flash("errors", "Error fetching deliveries.");
        console.error("Error fetching deliveries:", err);
    }
}

export async function DeliveryActivation(req, res, next) {
    try {
        const id = req.body.DeliveryId;

        const delivery = await Users.findOne({ _id: id, role: Roles.DELIVERY });
        let activeStatus;

        if (!delivery) {
            return res.redirect("/deliveries/index");
        }

        if (!delivery.isActive) {
            activeStatus = true;
        } else {
            activeStatus = false;
        }

        await Users.findByIdAndUpdate(id, {
            isActive: activeStatus
        });

        req.flash("success", "Delivery activated or deactivated successfully.");
        return res.redirect("/deliveries/index");
    } catch (err) {
        req.flash("errors", "Error activating or deactivating delivery.");
        console.error("Error activating or deactivating delivery:", err);
    }
}

