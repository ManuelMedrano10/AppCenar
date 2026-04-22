import "../utils/LoadEnvConfiguration.js";
import connectDB from "../utils/MongooseConnection.js";
import Configurations from "../models/ConfigurationModel.js";

const createConfiguration = async () => {
    try {
        await connectDB();

        const configuration = new Configurations({
            ITBIS: process.env.CONFIGURATION_ITBIS
        });

        const configurationsExisting = Configurations.find();
        if(configurationsExisting.length > 1){
            console.log("A configuration already exists.");
            process.exit(0);
        }
        
        await configuration.save();

        console.log("Configuration created successfully.");

        process.exit(0);
    } catch (err) {
        console.error("Error creating configuration:", err);
        process.exit(1);
    }
}

createConfiguration();