import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = {
    auth: path.join(__dirname, "proto/auth.proto"),
    admin: path.join(__dirname, "proto/admin.proto"),
};

export default protoPath;
