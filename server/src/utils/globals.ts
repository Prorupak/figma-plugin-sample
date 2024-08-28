import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
export const FIGMA_CLIENT_ID = process.env.FIGMA_CLIENT_ID;
export const FIGMA_CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET;
export const REDIRECT_URI = "http://localhost:3000/callback";
