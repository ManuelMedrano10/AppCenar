import Users from "../../models/UserModel.js";
import path from "path";

export async function GetProfile(req, res) {
    try {
        const delivery = await Users.find({ _id: req.session.user._id }).lean();

        res.render("delivery/profile/index", {
            isDelivery: delivery,
            hasDelivery: delivery.length > 0,
            layout: "delivery-layout",
            "page-title": "Delivery Profile"
        });
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error fetching the profile.");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.DeliveryId;
        const delivery = await Users.findOne({ _id: id }).lean();

        if (!delivery) {
            return res.redirect("/delivery-profile/index");
        }

        res.render("delivery/profile/save", {
            delivery,
            layout: "delivery-layout",
            "page-title": `Edit Delivery Profile ${delivery.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching profile.");
        console.error("Error fetching profile:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Lastname, Phone, DeliveryId } = req.body;
        const Photo = req.file;
        const delivery = await Users.findOne({ _id: DeliveryId }).lean();

        if (!delivery) {
            return res.redirect("/delivery-profile/index");
        }

        let PhotoPath = delivery.photo;
        if (Photo) {
            PhotoPath = "\\" + path.relative("public", Photo.path);
        }

        await Users.findByIdAndUpdate(DeliveryId, {
            name: Name,
            lastname: Lastname,
            phone: Phone,
            photo: PhotoPath,
        });

        req.flash("success", "Profile updated successfully.");
        return res.redirect("/delivery-profile/index");
    } catch (err) {
        console.error("Error updating profile:", err);
        req.flash("errors", "Error updating profile.");
    }
}