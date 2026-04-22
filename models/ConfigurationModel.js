import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema({
    ITBIS: {
        type: Number,
        required: true
    }
},
{
    timestamps: true,
    collection: "Configurations"
});

const Configurations = mongoose.model("Configurations", configurationSchema);

export default Configurations;