import Users from "../../models/UserModel.js";
import path from "path";

export async function GetProfile(req, res) {
    try {
        const commerce = await Users.find({ _id: req.session.user._id }).lean();

        res.render("commerce/profile/index", {
            isCommerce: commerce,
            hasCommerce: commerce.length > 0,
            layout: "commerce-layout",
            "page-title": "Commerce Profile"
        });
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error fetching the profile.");
        return res.redirect("/commerce-home/home");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.CommerceId;
        const commerce = await Users.findOne({ _id: id }).lean();

        if (!commerce) {
            return res.redirect("/commerce-profile/index");
        }

        res.render("commerce/profile/save", {
            commerce,
            layout: "commerce-layout",
            "page-title": `Edit Commerce Profile ${commerce.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching profile.");
        console.error("Error fetching profile:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { OpeningHour, ClosingHour, Phone, Email, CommerceId } = req.body;
        const Logo = req.file;
        const commerce = await Users.findOne({ _id: CommerceId }).lean();

        if (!commerce) {
            return res.redirect("/commerce-profile/index");
        }

        const existingEmail = await Users.findOne({ email: Email, _id: { $ne: CommerceId } });
        if (existingEmail) {
            req.flash("errors", "A commerce already exists with this email.");
            return res.redirect(`/commerce-profile/edit/${CommerceId}`);
        }

        let LogoPath = commerce.photo;
        if (Logo) {
            LogoPath = "\\" + path.relative("public", Logo.path);
        }

        await Users.findByIdAndUpdate(CommerceId, {
            photo: LogoPath,
            openingHour: OpeningHour,
            closingHour: ClosingHour,
            phone: Phone,
            email: Email
        });

        req.flash("success", "Profile updated successfully.");
        return res.redirect("/commerce-profile/index");
    } catch (err) {
        console.error("Error updating profile:", err);
        req.flash("errors", "Error updating profile.");
    }
}