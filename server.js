import app from "./src/app";
import { port } from "./src/configs";
import logger from "./src/core/logger";

app.listen(port, () => {
    logger.info(`server running on port : ${port}`);
}).on("error", e => logger.error(e));
