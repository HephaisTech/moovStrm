const express = require("express");
const { z } = require("zod");
function BaseRouter(controller, options = {}) {
  const router = express.Router();
  const {
    createSchema,
    readSchema,
    updateSchema,
    enableSearch = true,
    enableMultiCreate = true,
    extraRoutes = (router, controller) => {},
  } = options;
  router.get("/", controller.All);
  router.post("/id", controller.getById);
  if (enableSearch) {
    router.post("/search", controller.Search);
  }
  if (createSchema) {
    router.post("/", controller.create);
  }

  if (enableMultiCreate && createSchema) {
    router.post("/multi", controller.createMulti);
  }
  if (updateSchema) {
    router.put("/", controller.update);
  }
  router.delete("/id", controller.delete);
  router.post("/restore/id", controller.restore);
  router.delete("/destroy/id", controller.destroy);
  extraRoutes(router, controller);

  return router;
}
module.exports = BaseRouter;
