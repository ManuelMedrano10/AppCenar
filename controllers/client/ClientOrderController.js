import Users from "../../models/UserModel.js";
import ClientsAddresses from "../../models/ClientsAddressesModel.js";
import Orders from "../../models/OrdersModel.js";
import Status from "../../utils/enums/OrdersStatus.js";
import Configurations from "../../models/ConfigurationModel.js";

export async function GetCreate(req, res) {
    try {
        const cart = req.session.cart;
        const clientId = req.session.user._id;

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.redirect("/client-home/home");
        }

        const clientAddresses = await ClientsAddresses.find({ userId: clientId }).lean();
        const commerce = await Users.findOne({ _id: cart.commerceId }).lean();
        const configurations = await Configurations.findOne().lean();

        const ITBIS = configurations ? configurations.ITBIS : 18;

        const subtotal = cart.subtotal;
        const itbisValue = subtotal * (ITBIS / 100);
        const total = subtotal + itbisValue;

        res.render("clients/checkout/index", {
            cartItems: cart.items,
            subtotal: subtotal.toFixed(2),
            itbisPercentage: configurations.ITBIS || 18,
            itbisValue: itbisValue.toFixed(2),
            total: total.toFixed(2),
            commerce,
            clientAddressesList: clientAddresses,
            hasAddresses: clientAddresses.length > 0,
            layout: "client-layout",
            "page-title": "Your Order"
        });

    } catch (err) {
        req.flash("errors", "Error fetching data to process the order.");
        console.error("Error fetching data to process the order:", err);
    }
}

export async function PostCreate(req, res) {
    try {
        const { clientAddressId } = req.body;
        const cart = req.session.cart;
        const clientId = req.session.user._id;
        const configurations = await Configurations.findOne().lean();

        if (!cart) {
            req.flash("errors", "Your order was not proccessed due to incomplete data.");
            return res.redirect("/client-order/create");
        }
        const ITBIS = configurations ? configurations.ITBIS : 18;

        const subtotal = cart.subtotal;
        const total = subtotal + (subtotal * (ITBIS / 100));

        const productIds = cart.items.map(item => item.productId);

        await Orders.create({
            productId: productIds,
            userId: clientId,
            clientAddressId: clientAddressId,
            commerceId: cart.commerceId,
            status: Status.PENDING,
            dateTimeOrder: new Date(),
            subtotal: subtotal,
            total: total
        });

        req.session.cart = null;

        req.flash("success", "Order created successfully.");
        return res.redirect("/client-home/home");
    } catch (err) {
        req.flash("errors", "Error processing the order.");
        console.error("Error processing the order:", err);
    }
}