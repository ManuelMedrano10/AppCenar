import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import OrderModels from "../../models/OrdersModel.js";

export async function GetCommercesIndex(req, res, next) {
    try {
        const commerces = await Users.aggregate([
            {
                $match: { role: Roles.COMMERCE }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Orders",
                    localField: "_id",
                    foreignField: "commerceId",
                    as: "ordersAmount"
                }
            },
            {
                $addFields: {
                    orderQuantity: { $size: "$ordersAmount" }
                }
            },
            {
                $project: {
                    ordersAmount: 0
                }
            }
        ]);

        res.render("admin/commerces/index", {
            commercesList: commerces,
            hasCommerces: commerces.length > 0,
            "page-title": "Commerces list"
        });
    } catch (err) {
        req.flash("errors", "Error fetching commerces.");
        console.error("Error fetching commerces:", err);
    }
}

export async function CommerceActivation(req, res, next) {
    try {
        const id = req.body.CommerceId;

        const commerce = await Users.findOne({ _id: id, role: Roles.COMMERCE });
        let activeStatus;

        if (!commerce) {
            return res.redirect("/commerces/index");
        }

        if (!commerce.isActive) {
            activeStatus = true;
        } else {
            activeStatus = false;
        }

        await Users.findByIdAndUpdate(id, {
            isActive: activeStatus
        });

        req.flash("success", "Commerce activated or deactivated successfully.");
        return res.redirect("/commerces/index");
    } catch (err) {
        req.flash("errors", "Error activating or deactivating admin.");
        console.error("Error activating or deactivating admin:", err);
    }
}

