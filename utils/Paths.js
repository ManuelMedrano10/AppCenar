import { fileURLToPath } from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

export const projectRoot = path.resolve(__dirName, "..");