import mongoose from "mongoose";

const clientAddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
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
    collection: "ClientsAddresses"
});

const ClientsAddresses = mongoose.model("ClientsAddresses", clientAddressSchema);

export default ClientsAddresses;