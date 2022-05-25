import app from "./app";
import { port } from "./configs";
import logger from "./core/logger";

app.listen(port, () => {
    logger.info(`server running on port : ${port}`);
}).on("error", e => logger.error(e));
