require("dotenv").config();

// Mapper for environment variables
const environment = process.env.NODE_ENV;
const port = process.env.PORT;

const logDirectory = process.env.LOG_DIR;

module.exports = {
    environment,
    port,
    logDirectory,
};
