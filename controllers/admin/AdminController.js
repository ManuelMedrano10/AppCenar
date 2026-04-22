import Users from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import Roles from "../../utils/enums/Roles.js";

export async function GetIndex(req, res, next) {
    try {
        const admins = await Users.find({ role: Roles.ADMIN }).sort({ createdAt: -1 }).lean();

        res.render("admin/admins/index", {
            adminsList: admins,
            hasAdmins: admins.length > 0,
            "page-title": "Admins list"
        });
    } catch (err) {
        req.flash("errors", "Error fetching admins.");
        console.error("Error fetching admins:", err);
    }
}

export function GetCreate(req, res, next) {
    res.render("admin/admins/save", {
        editMode: false,
        "page-title": "New Admins"
    });
}

export async function PostCreate(req, res, next) {
    try {
        const { Name, Lastname, Cedula, Email, Username, Password, ConfirmPassword } = req.body;

        if (Password !== ConfirmPassword) {
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/admins/create");
        }

        const existingEmail = await Users.findOne({ email: Email });
        if (existingEmail) {
            req.flash("errors", "Admin already exists with this email.");
            return res.redirect("/admins/create");
        }

        const existingUsername = await Users.findOne({ username: Username });
        if (existingUsername) {
            req.flash("errors", "Admin already exists with this username.");
            return res.redirect("/admins/create");
        }

        const existingCedula = await Users.findOne({ cedula: Cedula });
        if (existingCedula) {
            req.flash("errors", "Admin already exists with this cedula.");
            return res.redirect("/admins/create");
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        await Users.create({
            name: Name,
            lastname: Lastname,
            cedula: Cedula,
            email: Email,
            role: Roles.ADMIN,
            username: Username,
            password: hashedPassword,
            isActive: false
        });

        req.flash("success", "Admin created successfully.");

        return res.redirect("/admins/index");
    } catch (err) {
        req.flash("errors", "Error creating admin.");
        console.error("Error creating admin:", err);
    }
}

export async function GetEdit(req, res, next) {
    try {
        const id = req.params.AdminId;
        const admin = await Users.findOne({ _id: id, role: Roles.ADMIN }).lean();

        if (!admin) {
            return res.redirect("/admins/index");
        }

        res.render("admin/admins/save", {
            editMode: true,
            admin,
            "page-title": `Edit Admin ${admin.name}`
        });

    } catch (err) {
        req.flash("errors", "Error fetching admins.");
        console.error("Error fetching admins:", err);
    }
}

export async function PostEdit(req, res, next) {
    try {
        const { Name, Lastname, Cedula, Email, Username, Password, ConfirmPassword, AdminId } = req.body;

        const admin = await Users.findOne({ _id: AdminId });

        if (!admin) {
            return res.redirect("/admins/index");
        }

        if (Password !== ConfirmPassword) {
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/admins/save");
        }

        const existingEmail = await Users.findOne({ email: Email });
        if (existingEmail && admin.email !== Email) {
            req.flash("errors", "Admin already exists with this email.");
            return res.redirect("/admins/edit");
        }

        const existingCedula = await Users.findOne({ cedula: Cedula });
        if (existingCedula && admin.cedula !== Cedula) {
            req.flash("errors", "Admin already exists with this cedula.");
            return res.redirect("/admins/edit");
        }

        const existingUsername = await Users.findOne({ username: Username });
        if (existingUsername && admin.username !== Username) {
            req.flash("errors", "Admin already exists with this username.");
            return res.redirect("/admins/edit");
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        await Users.findByIdAndUpdate(AdminId, {
            name: Name,
            lastname: Lastname,
            cedula: Cedula,
            email: Email,
            role: Roles.ADMIN,
            username: Username,
            password: hashedPassword,
        });

        req.flash("success", "Admin updated successfully.");
        return res.redirect("/admins/index");

    } catch (err) {
        req.flash("errors", "Error updating admin.");
        console.error("Error updating admin:", err);
    }
}

export async function AdminActivation(req, res, next) {
    try {
        const id = req.body.AdminId;

        const admin = await Users.findOne({ _id: id });
        let activeStatus;

        if (!admin) {
            return res.redirect("/admins/index");
        }

        if (!admin.isActive) {
            activeStatus = true;
        } else {
            activeStatus = false;
        }

        await Users.findByIdAndUpdate(id, {
            isActive: activeStatus
        });

        req.flash("success", "Admin activated or deactivated successfully.");
        return res.redirect("/admins/index");
    } catch (err) {
        req.flash("errors", "Error activating or deactivating admin.");
        console.error("Error activating or deactivating admin:", err);
    }
}