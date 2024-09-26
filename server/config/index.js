import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const URL = process.env.URL;
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export { URL, SERVER_PORT, MONGODB_URI, JWT_SECRET };
