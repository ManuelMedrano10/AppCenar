import ClientFavorites from "../../models/ClientFavoritesModel.js";
import Users from "../../models/UserModel.js";

export async function GetIndex(req, res) {
    try {
        const result = await ClientFavorites.find({ userId: req.user._id }).populate("commerceId").lean();

        const favorites = result || [];

        res.render("clients/favorites/index", {
            favoritesList: favorites,
            hasFavorites: favorites.length > 0,
            layout: "client-layout",
            "page-title": "My Favorites"
        })
    } catch (err) {
        req.flash("errors", "Error fetching favorites.");
        console.error("Error fetching favorites:", err);
    }
}

export async function AddFavorite(req, res) {
    try {
        const { CommerceId } = req.body;
        const commerce = await Users.findOne({ _id: CommerceId }).lean();

        await ClientFavorites.create({
            commerceId: CommerceId,
            userId: req.user._id
        });

        req.flash("success", "Commerce added to favorites successfully.");
        return res.redirect(`/client-home/commerce-list/${commerce.commerceTypeId}`);
    } catch (err) {
        req.flash("errors", "Error adding favorite.");
        console.error("Error adding favorite:", err);
    }
}

export async function RemoveFavoriteInCommerceList(req, res) {
    try {
        const { CommerceId } = req.body;
        const commerce = await Users.findOne({ _id: CommerceId }).lean();
        const favorite = await ClientFavorites.findOne({ commerceId: CommerceId, userId: req.user._id }).lean();

        if (!favorite) {
            return res.redirect(`/client-home/commerce-list/${commerce.commerceTypeId.toString()}`);
        }

        if (favorite) {
            await ClientFavorites.deleteOne({ _id: favorite._id });
            req.flash("success", "Commerce removed successfully.");
        }

        return res.redirect(`/client-home/commerce-list/${commerce.commerceTypeId.toString()}`);
    } catch (err) {
        req.flash("errors", "Error removing products to order.");
        console.error("Error adding removing to order:", err);
    }
}

export async function Delete(req, res) {
    try {
        const id = req.body.FavoritedId;

        const favorite = await ClientFavorites.findOne({ _id: id, userId: req.user._id });

        if (!favorite) {
            return res.redirect("/favorites/index");
        }

        await ClientFavorites.deleteOne({ _id: id, userId: req.user._id });

        req.flash("success", "Favorite deleted successfully.");
        res.redirect("/favorites/index");
    } catch (err) {
        req.flash("errors", "Error deleting favorites.");
        console.error("Error deleting favorites:", err);
    }
}