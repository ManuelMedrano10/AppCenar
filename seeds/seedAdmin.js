import "../utils/LoadEnvConfiguration.js";
import bcrypt from "bcrypt";
import Roles from "../utils/enums/Roles.js";
import Users from "../models/UserModel.js";
import connectDB from "../utils/MongooseConnection.js";

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Users.findOne({ email: process.env.ADMIN_EMAIL, role: Roles.ADMIN });

        if(existingAdmin){
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        const newAdmin = new Users({
            name: "Manuel",
            lastname: "Medrano",
            cedula: process.env.ADMIN_CEDULA,
            email: process.env.ADMIN_EMAIL,
            username: process.env.ADMIN_USERNAME,
            role: Roles.ADMIN,
            password: hashedPassword,
            isActive: true
        });

        await newAdmin.save();

        console.log("New admin created successfully.");

        process.exit(0);
    } catch (err) {
        console.error("Error creating new admin:", err);
        process.exit(1);
    }
};

createAdmin();