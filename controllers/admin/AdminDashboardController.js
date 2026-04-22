import Orders from "../../models/OrdersModel.js";
import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";
import Products from "../../models/ProductsModel.js";

export async function GetDashboard(req, res) {
    try {
        const start = new Date().toDateString();
        const ordersToday = await Orders.find({ dateTimeOrder: { $gte: start } }).countDocuments();
        const orders = await Orders.find().countDocuments();
        const activeCommerce = await Users.find({ role: Roles.COMMERCE, isActive: true }).countDocuments();
        const inactiveCommerce = await Users.find({ role: Roles.COMMERCE, isActive: false }).countDocuments();
        const activeClient = await Users.find({ role: Roles.CLIENT, isActive: true }).countDocuments();
        const inactiveClient = await Users.find({ role: Roles.CLIENT, isActive: false }).countDocuments();
        const activeDelivery = await Users.find({ role: Roles.DELIVERY, isActive: true }).countDocuments();
        const inactiveDelivery = await Users.find({ role: Roles.DELIVERY, isActive: false }).countDocuments();
        const products = await Products.find().countDocuments();

        res.render("admin/dashboard/index", {
            products,
            orders,
            ordersToday,
            activeClient,
            inactiveClient,
            activeCommerce,
            inactiveCommerce,
            activeDelivery,
            inactiveDelivery,
            "page-title": "Dashboard"
        });

    } catch (err) {
        req.flash("errors", "Error fetching data.");
        console.error("Error fetching data:", err);
    }
}