import CommerceTypes from "../../models/CommerceTypeModel.js";
import Users from "../../models/UserModel.js";
import { projectRoot } from "../../utils/Paths.js";
import fs from "fs";
import path from "path";

export async function GetIndex(req, res) {
    try {
        const commerceTypes = await CommerceTypes.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Users",
                    localField: "_id",
                    foreignField: "commerceTypeId",
                    as: "commercesAmount"
                }
            },
            {
                $addFields: {
                    commerceQuantity: { $size: "$commercesAmount" }
                }
            },
            {
                $project: {
                    commercesAmount: 0
                }
            }
        ]);

        res.render("admin/commerce-types/index", {
            commerceTypesList: commerceTypes,
            hasCommerceTypes: commerceTypes.length > 0,
            "page-title": "Commerce Types List"
        });

    } catch (err) {
        req.flash("errors", "Error fetching commerce types.");
        console.error("Error fetching commerce types:", err);
    }
}

export function GetCreate(req, res) {
    res.render("admin/commerce-types/save", {
        editMode: false,
        "page-title": "New Commerce Type",
    });
}

export async function PostCreate(req, res) {
    try {
        const { Name, Description } = req.body;
        const Icon = req.file;
        const IconPath = "\\" + path.relative("public", Icon.path);

        await CommerceTypes.create({
            name: Name,
            Description: Description,
            Icon: IconPath
        });

        req.flash("success", "Commerce Type created successfully.");
        return res.redirect("/commerce-types/index");
    } catch (err) {
        console.error("Error creating commerce types:", err);
        req.flash("errors", "Error creating commerce types.");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.CommerceTypeId;
        const commerceType = await CommerceTypes.findOne({ _id: id }).lean();

        if (!commerceType) {
            return res.redirect("/commerce-type/index");
        }

        res.render("admin/commerce-types/save", {
            editMode: true,
            commerceType,
            "page-title": `Edit Commerce Type ${commerceType.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching commerce types.");
        console.error("Error fetching commerce types:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Description, CommerceTypeId } = req.body;
        const Icon = req.file;

        const commerceType = await CommerceTypes.findOne({ _id: CommerceTypeId }).lean();

        if (!commerceType) {
            return res.redirect("/commerce-type/index");
        }

        let IconPath = commerceType.Icon;
        if (Icon) {
            IconPath = "\\" + path.relative("public", Icon.path);
        }

        await CommerceTypes.findByIdAndUpdate(CommerceTypeId, {
            name: Name,
            Description: Description,
            Icon: IconPath
        });

        req.flash("success", "Commerce Type updated successfully.");
        return res.redirect("/commerce-types/index");
    } catch (err) {
        console.error("Error updating commerce types:", err);
        req.flash("errors", "Error updating commerce types.");
    }
}

export async function Delete(req, res) {
    try {
        const id = req.body.CommerceTypeId;
        const commerceType = await CommerceTypes.findOne({ _id: id }).lean();

        if (!commerceType) {
            return res.redirect("/commerce-type/index");
        }

        if (commerceType.Icon) {
            const IconPath = path.join(projectRoot, "public", commerceType.Icon);
            if (fs.existsSync(IconPath)) {
                fs.unlinkSync(IconPath);
            }
        }

        await CommerceTypes.deleteOne({ _id: id });

        req.flash("success", "Commerce Type deleted successfully.");
        return res.redirect("/commerce-types/index");
    } catch (err) {
        console.error("Error deleting commerce type:", err);
        req.flash("errors", "Error deleting commerce type.");
    }
}