const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const { environment, logDirectory } = require("../configs");

let dir = logDirectory;
if (!dir) dir = path.resolve("logs");

// create directory if it is not present
if (!fs.existsSync(dir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(dir);
}

const logLevel = environment === "development" ? "debug" : "warn";

const options = {
    file: {
        level: logLevel,
        filename: `${dir}/%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        timestamp: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        prettyPrint: true,
        json: true,
        maxSize: "20m",
        colorize: true,
        maxFiles: "14d",
    },
};

module.exports = createLogger({
    transports: [
        new transports.Console({
            level: logLevel,
            format: format.combine(
                format.errors({ stack: true }),
                format.prettyPrint(),
            ),
        }),
    ],
    exceptionHandlers: [new DailyRotateFile(options.file)],
    exitOnError: false, // do not exit on handled exceptions
});
