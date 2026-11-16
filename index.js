const app = require("./server");
const dao = require("./src/configs/db/doa");
const logger = require("./src/configs/utils/internalAccess");
const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  try {
    logger.info("Background jobs started");
    app.listen(PORT, () => {
      logger.info(`API base: http://localhost:${PORT}/api/`);
    });
  } catch (err) {
    logger.error("Bootstrap failed", err);
    process.exit(1);
  }
};

bootstrap();
