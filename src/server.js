const app = require("./app");
const { port } = require("./configs");
const logger = require("./core/logger");

app.listen(port, () => {
    logger.info(`server running on port : ${port}`);
}).on("error", e => logger.error(e));
