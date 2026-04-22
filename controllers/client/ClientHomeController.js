import Categories from "../../models/CategoriesModel.js";
import ClientsFavorites from "../../models/ClientFavoritesModel.js";
import CommerceTypes from "../../models/CommerceTypeModel.js";
import Products from "../../models/ProductsModel.js";
import Users from "../../models/UserModel.js";
import Roles from "../../utils/enums/Roles.js";

export async function GetClientHome(req, res) {
    try {
        const commerceTypes = await CommerceTypes.find().lean();

        res.render("clients/home/home", {
            commerceTypesList: commerceTypes,
            hasCommerceTypes: commerceTypes.length > 0,
            layout: "client-layout",
            "page-title": "Home"
        });
    } catch (err) {
        req.flash("errors", "Error fetching commerce types.");
        console.error("Error fetching comerce types:", err);
    }
}

export async function GetCommerceList(req, res) {
    try {
        const commerceTypeId = req.params.CommerceTypeId;
        const commerceTypeSelected = await CommerceTypes.findOne({ _id: commerceTypeId }).lean();

        let commercesSelected = await Users.find({ commerceTypeId: commerceTypeId }).populate("commerceTypeId").lean();

        const userFavorites = await ClientsFavorites.find({ userId: req.user._id }).lean();

        commercesSelected = commercesSelected.map(commerce => {
            const isFavorite = userFavorites.some(fav => fav.commerceId.toString() === commerce._id.toString());
            return {
                ...commerce,
                isFavorite,
                commerceIdString: commerce._id.toString()
            };
        });

        res.render("clients/home/commerces", {
            commerceTypeSelected,
            commerceList: commercesSelected,
            hasCommerce: commercesSelected.length > 0,
            commercesCount: commercesSelected.length,
            layout: "client-layout",
            "page-title": "Commerces List"
        });

    } catch (err) {
        req.flash("errors", "Error fetching list of commerces.");
        console.error("Error fetching list of commerces:", err);
    }
}

export async function GetCommerceByName(req, res) {
    try {
        const nameFiltered = req.body.NameFilter;

        let commerces = await Users.find({ 
            name: { $regex: nameFiltered, $options: "i" }, 
            role: Roles.COMMERCE 
        }).populate("commerceTypeId").lean();

        const commerceTypes = await CommerceTypes.find().lean();
        const userFavorites = await ClientsFavorites.find({ userId: req.user._id }).lean();

        commerces = commerces.map(commerce => {
            const isFavorite = userFavorites.some(fav => fav.commerceId.toString() === commerce._id.toString());
            return {
                ...commerce,
                isFavorite,
                commerceIdString: commerce._id.toString()
            };
        });

        res.render("clients/home/commerces", {
            commerceTypesList: commerceTypes, 
            hasCommerceTypes: commerceTypes.length > 0,
            commerceList: commerces,
            hasCommerce: commerces.length > 0,
            commercesCount: commerces.length,
            layout: "client-layout",
            "page-title": "Commerces List"
        });

    } catch (err) {
        req.flash("errors", "Error fetching commerces.");
        console.error("Error fetching commerces:", err);
    }
}

export async function GetCommerceCatalogue(req, res) {
    try {
        const commerceId = req.params.CommerceId;
        const commerceSelected = await Users.findOne({ _id: commerceId }).lean();

        if (!commerceSelected) {
            req.flash("errors", "Error finding the commerce.");
            return res.redirect("/client-home/home");
        }

        let commerceProducts = await Products.find({ userId: commerceId }).sort({ categoryId: -1 }).populate("categoryId").populate("userId").lean();

        let cart = req.session.cart;

        if (!cart || cart.commerceId !== commerceId) {
            cart = {
                items: [],
                subtotal: 0,
                commerceId: commerceId
            };
            req.session.cart = cart;
        }

        commerceSelected._id = commerceSelected._id.toString();

        commerceProducts = commerceProducts.map(product => {
            const isInCart = cart.items.some(item => item.productId === product._id.toString());
            return {
                ...product,
                isInCart,
                productId: product._id.toString(),
                commerceId: commerceId.toString()
            }
        });

        const groupedObj = commerceProducts.reduce((acc, product) => {
            const catName = product.categoryId ? product.categoryId.name : "Others";

            if (!acc[catName]) {
                acc[catName] = {
                    categoryName: catName,
                    products: []
                };
            }
            
            acc[catName].products.push(product);
            return acc;
        }, {});

        const groupedProduct = Object.values(groupedObj);

        res.render("clients/home/commerce-catalogue", {
            groupedProductList: groupedProduct,
            commerceSelected,
            commerceProductsList: commerceProducts,
            hasProducts: commerceProducts.length > 0,
            cartItems: cart.items,
            cartSubtotal: cart.subtotal,
            isCartEmpty: cart.items.length === 0,
            layout: "client-layout",
            "page-title": `${commerceSelected.name} catalogue`
        });

    } catch (err) {
        req.flash("errors", "Error fetching commerce catalogue of products.");
        console.error("Error fetching commerce catalogue of products:", err);
    }
}

export async function AddProductToKart(req, res) {
    try {
        const { ProductId, CommerceId } = req.body;

        const product = await Products.findOne({ _id: ProductId }).lean();

        if (!req.session.cart) {
            req.session.cart = { items: [], subtotal: 0, commerceId: CommerceId };
        }

        const alreadyInCart = req.session.cart.items.find(item => item.productId === ProductId);

        if (!alreadyInCart) {
            req.session.cart.items.push({
                productId: product._id.toString(),
                name: product.name,
                price: product.price
            });

            req.session.cart.subtotal += product.price;
        }

        return res.redirect(`/client-home/commerce-catalogue/${CommerceId}`);
    } catch (err) {
        req.flash("errors", "Error adding products to order.");
        console.error("Error adding products to order:", err);
    }
}

export async function RemoveProductFromKart(req, res) {
    try {
        const { ProductId, CommerceId } = req.body;

        if (req.session.cart) {
            const itemToRemove = req.session.cart.items.find(item => item.productId === ProductId);

            if (itemToRemove) {
                req.session.cart.subtotal -= itemToRemove.price;

                req.session.cart.items = req.session.cart.items.filter(item => item.productId !== ProductId);
            }
        }

        return res.redirect(`/client-home/commerce-catalogue/${CommerceId}`);
    } catch (err) {
        req.flash("errors", "Error removing products to order.");
        console.error("Error adding removing to order:", err);
    }
}