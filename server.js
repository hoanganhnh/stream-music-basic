const app = require("./src/app");
const { port } = require("./src/configs");
const logger = require("./src/core/logger");

app.listen(port, () => {
    logger.info(`server running on port : ${port}`);
}).on("error", e => logger.error(e));
