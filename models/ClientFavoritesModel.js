import mongoose from "mongoose";

const clientFavoriteSchema = new mongoose.Schema({
    commerceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
},
{
    timestamps: true,
    collection: "ClientsFavorites"
});

const ClientsFavorites = mongoose.model("ClientsFavorites", clientFavoriteSchema);

export default ClientsFavorites;