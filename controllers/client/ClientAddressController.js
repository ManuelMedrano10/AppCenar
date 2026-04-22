import ClientsAddresses from "../../models/ClientsAddressesModel.js";

export async function GetIndex(req,res) {
    try {
        const result = await ClientsAddresses.find({ userId: req.user._id }).lean();

        const addresses = result || [];

        res.render("clients/addresses/index", {
            addressesList: addresses,
            hasAddresses: addresses.length > 0,
            layout: "client-layout",
            "page-title": "My Address"
        })
    } catch (err) {
        req.flash("errors", "Error fetching addresses.");
        console.error("Error fetching addresses:", err);
    }
}

export function GetCreate(req, res) {
    res.render("clients/addresses/save", {
        layout: "client-layout",
        editMode: false,
        "page-title": "New Address",
    });
}

export async function PostCreate(req, res) {
    try {
        const { Name, Description } = req.body;

        await ClientsAddresses.create({
            name: Name,
            Description: Description,
            userId: req.user._id
        });

        req.flash("success", "Address created successfully.");
        return res.redirect("/addresses/index");
    } catch (err) {
        console.error("Error creating addresses:", err);
        req.flash("errors", "Error creating addresses.");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.AddressId;
        const address = await ClientsAddresses.findOne({ _id: id, userId: req.user._id }).lean();

        if (!address) {
            return res.redirect("/addresses/index");
        }

        res.render("clients/addresses/save", {
            layout: "client-layout",
            editMode: true,
            address,
            "page-title": `Edit Address ${address.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching addresses.");
        console.error("Error fetching addresses:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Description, AddressId } = req.body;

        const address = await ClientsAddresses.findOne({ _id: AddressId, userId: req.user._id }).lean();

        if (!address) {
            return res.redirect("/addresses/index");
        }

        await ClientsAddresses.findByIdAndUpdate(AddressId, {
            name: Name,
            Description: Description,
            userId: req.user._id
        });

        req.flash("success", "Address updated successfully.");
        return res.redirect("/addresses/index");
    } catch (err) {
        console.error("Error updating addresses:", err);
        req.flash("errors", "Error addresses.");
    }
}

export async function Delete(req, res) {
    try {
        const id = req.body.AddressId;
        const address = await ClientsAddresses.findOne({ _id: id }).lean();

        if (!address) {
            return res.redirect("/addresses/index");
        }

        await ClientsAddresses.deleteOne({ _id: id });

        req.flash("success", "Address deleted successfully.");
        return res.redirect("/addresses/index");
    } catch (err) {
        console.error("Error deleting address:", err);
        req.flash("errors", "Error deleting address.");
    }
}