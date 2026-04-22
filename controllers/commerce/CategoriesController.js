import mongoose from "mongoose";
import Categories from "../../models/CategoriesModel.js";

export async function GetIndex(req, res) {
    try {
        const userId = req.user._id;

        const categories = await Categories.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Products",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "productsAmount"
                }
            },
            {
                $addFields: {
                    productQuantity: { $size: "$productsAmount" }
                }
            },
            {
                $project: {
                    productsAmount: 0
                }
            }
        ]);

        res.render("commerce/categories/index", {
            layout: "commerce-layout",
            categoriesList: categories,
            hasCategories: categories.length > 0,
            "page-title": "Categories List"
        });
    } catch (err) {
        req.flash("errors", "Error fetching categories.");
        console.error("Error fetching categories:", err);
    }
}

export function GetCreate(req, res) {
    res.render("commerce/categories/save", {
        layout: "commerce-layout",
        editMode: false,
        "page-title": "New Category",
    });
}

export async function PostCreate(req, res) {
    try {
        const { Name, Description } = req.body;

        await Categories.create({
            name: Name,
            Description: Description,
            userId: req.user._id
        });

        req.flash("success", "Category created successfully.");
        return res.redirect("/categories/index");
    } catch (err) {
        console.error("Error creating categories:", err);
        req.flash("errors", "Error creating categories.");
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.CategoryId;
        const category = await Categories.findOne({ _id: id, userId: req.user._id }).lean();

        if (!category) {
            return res.redirect("/categories/index");
        }

        res.render("commerce/categories/save", {
            layout: "commerce-layout",
            editMode: true,
            category,
            "page-title": `Edit Category ${category.name}`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching categories.");
        console.error("Error fetching categories:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Description, CategoryId } = req.body;

        const category = await Categories.findOne({ _id: CategoryId, userId: req.user._id }).lean();

        if (!category) {
            return res.redirect("/categories/index");
        }

        await Categories.findByIdAndUpdate(CategoryId, {
            name: Name,
            Description: Description,
            userId: req.user._id
        });

        req.flash("success", "Category updated successfully.");
        return res.redirect("/categories/index");
    } catch (err) {
        console.error("Error updating categories:", err);
        req.flash("errors", "Error updating.");
    }
}

export async function Delete(req, res) {
    try {
        const id = req.body.CategoryId;
        const category = await Categories.findOne({ _id: id }).lean();

        if (!category) {
            return res.redirect("/categories/index");
        }

        await Categories.deleteOne({ _id: id });

        req.flash("success", "Category deleted successfully.");
        return res.redirect("/categories/index");
    } catch (err) {
        console.error("Error deleting category:", err);
        req.flash("errors", "Error deleting category.");
    }
}