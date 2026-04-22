import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import OrderModels from "../../models/OrdersModel.js";

export async function GetClientsIndex(req, res, next) {
    try {
        const clients = await Users.aggregate([
            {
                $match: { role: Roles.CLIENT }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Orders",
                    localField: "_id",
                    foreignField: "userId",
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

        res.render("admin/clients/index", {
            clientsList: clients,
            hasClients: clients.length > 0,
            "page-title": "Clients list"
        });
    } catch (err) {
        req.flash("errors", "Error fetching clients.");
        console.error("Error fetching clients:", err);
    }
}

export async function ClientActivation(req, res, next) {
    try {
        const id = req.body.ClientId;

        const client = await Users.findOne({ _id: id, role: Roles.CLIENT });
        let activeStatus;

        if (!client) {
            return res.redirect("/clients/index");
        }

        if (!client.isActive) {
            activeStatus = true;
        } else {
            activeStatus = false;
        }

        await Users.findByIdAndUpdate(id, {
            isActive: activeStatus
        });

        req.flash("success", "Client activated or deactivated successfully.");
        return res.redirect("/clients/index");
    } catch (err) {
        req.flash("errors", "Error activating or deactivating client.");
        console.error("Error activating or deactivating client:", err);
    }
}

