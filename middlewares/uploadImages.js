import { projectRoot } from "../utils/Paths.js";
import multer from "multer";
import fs from "fs";
import { v4 as guidV4 } from "uuid";
import path from "path";

//Multer setup
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dynamicDirectory = path.join(projectRoot, "public", "assets", "images", "general");

        if(file.fieldname === "Photo") {
            dynamicDirectory = path.join(projectRoot, "public", "assets", "images", "clients-photos");
        } else if(file.fieldname === "Icon") {
            dynamicDirectory = path.join(projectRoot, "public", "assets", "images", "Commerces-Types-Icons");
        } else if(file.fieldname === "Logo") {
            dynamicDirectory = path.join(projectRoot, "public", "assets", "images", "Commerces-logos");
        } else if(file.fieldname === "ProductPhoto") {
            dynamicDirectory = path.join(projectRoot, "public", "assets", "images", "Product-photos");
        }

        if (!fs.existsSync(dynamicDirectory)) {
            fs.mkdirSync(dynamicDirectory, { recursive: true });
        }
        cb(null, dynamicDirectory);
    },
    filename: (req, file, cb) => {
        const filename = `${guidV4()}-${file.originalname}`;
        cb(null, filename);
    }
});


const upload = multer({ storage: imageStorage });
export default upload;