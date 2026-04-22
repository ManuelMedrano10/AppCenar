import Products from "../../models/ProductsModel.js";
import Categories from "../../models/CategoriesModel.js";
import path from "path";
import fs from "fs";
import { projectRoot } from "../../utils/Paths.js";

export async function GetIndex(req, res) {
    try {
        const products = await Products.find({ userId: req.user._id })
            .sort({ createdAt: -1 }).populate("categoryId").lean();

        res.render("commerce/products/index", {
            productsList: products,
            hasProducts: products.length > 0,
            layout: "commerce-layout",
            "page-title": "Products List"
        });
    } catch (err) {
        req.flash("errors", "Error fetching products.");
        console.error("Error fetching products:", err);
    }
}

export async function GetCreate(req, res) {
    try {
        const categories = await Categories.find({ userId: req.user._id }).lean();

        res.render("commerce/products/save", {
            editMode: false,
            categoriesList: categories,
            hasCategories: categories.length > 0,
            layout: "commerce-layout",
            "page-title": "New Product"
        });
    } catch (err) {
        req.flash("errors", "Error fetching categories.");
        console.error("Error fetching categories:", err);
    }
}

export async function PostCreate(req, res) {
    try {
        const { Name, Description, Price, CategoryId } = req.body;
        const ProductPhoto = req.file;
        const ProductPhotoPath = "\\" + path.relative("public", ProductPhoto.path);

        await Products.create({
            name: Name,
            Description: Description,
            price: Price,
            productPhoto: ProductPhotoPath,
            categoryId: CategoryId,
            userId: req.user._id
        });

        req.flash("success", "Product created successfully.");
        return res.redirect("/products/index");
    } catch (err) {
        req.flash("errors", "Error creating products.");
        console.error("Error creating products:", err);
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.ProductId;
        const product = await Products.findOne({ _id: id, userId: req.user._id }).lean();

        if (!product) {
            return res.redirect("/products/index");
        }

        const categories = await Categories.find({ userId: req.user._id }).lean();

        res.render("commerce/products/save", {
            editMode: true,
            product,
            categoriesList: categories,
            hasCategories: categories.length > 0,
            layout: "commerce-layout",
            "page-title": `Edit Product ${product.name}`
        });
    } catch (err) {
        req.flash("errors", "Error fetching products.");
        console.error("Error fetching products:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { Name, Description, Price, CategoryId, ProductId } = req.body;
        const ProductPhoto = req.file;

        const product = await Products.findOne({ _id: ProductId, userId: req.user._id });

        if (!product) {
            return res.redirect("/products/index");
        }

        let ProductPhotoPath = product.productPhoto;
        if (ProductPhoto) {
            ProductPhotoPath = "\\" + path.relative("public", ProductPhoto.path);
        }

        await Products.findByIdAndUpdate(ProductId, {
            name: Name,
            Description: Description,
            productPhoto: ProductPhotoPath,
            price: Price,
            categoryId: CategoryId,
            userId: req.user._id
        });

        req.flash("success", "Product updated successfully.");
        return res.redirect("/products/index");
    } catch (err) {
        req.flash("errors", "Error updating products.");
        console.error("Error updating products:", err);
    }
}

export async function Delete(req, res) {
    try {
        const id = req.body.ProductId;

        const product = await Products.findOne({ _id: id, userId: req.user._id })
            .sort({ createdAt: -1 }).populate("categoryId").lean();

        if (!product) {
            return res.redirect("/products/index");
        }

        if (product.productPhoto) {
            const productPhotoPath = path.join(projectRoot, "public", product.productPhoto);
            if (fs.existsSync(productPhotoPath)) {
                fs.unlinkSync(productPhotoPath);
            }
        }

        await Products.deleteOne({ _id: id, userId: req.user._id });

        req.flash("success", "Product deleted successfully.");
        res.redirect("/products/index");
    } catch (err) {
        req.flash("errors", "Error deleting products.");
        console.error("Error deleting products:", err);
    }
}