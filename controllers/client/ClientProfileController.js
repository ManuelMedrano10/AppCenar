import Users from "../../models/UserModel.js";
import path from "path";

export async function GetProfile(req, res) {
    try {
        const client = await Users.find({ _id: req.session.user._id }).lean();

        res.render("clients/profile/index", {
            isClient: client,
            hasClient: client.length > 0,
            layout: "client-layout",
            "page-title": "Client Profile"
        });
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error fetching the profile.");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.ClientId;
        const client = await Users.findOne({ _id: id }).lean();

        if (!client) {
            return res.redirect("/client-profile/index");
        }

        res.render("clients/profile/save", {
            client,
            layout: "client-layout",
            "page-title": `Edit Client Profile ${client.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching profile.");
        console.error("Error fetching profile:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Lastname, Phone, ClientId } = req.body;
        const Photo = req.file;
        const client = await Users.findOne({ _id: ClientId }).lean();

        if (!client) {
            return res.redirect("/client-profile/index");
        }

        let PhotoPath = client.photo;
        if (Photo) {
            PhotoPath = "\\" + path.relative("public", Photo.path);
        }

        await Users.findByIdAndUpdate(ClientId, {
            name: Name,
            lastname: Lastname,
            phone: Phone,
            photo: PhotoPath,
        });

        req.flash("success", "Profile updated successfully.");
        return res.redirect("/client-profile/index");
    } catch (err) {
        console.error("Error updating profile:", err);
        req.flash("errors", "Error updating profile.");
    }
}