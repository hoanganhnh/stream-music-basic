import { config } from "dotenv";

config();

// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const logDirectory = process.env.LOG_DIR;
