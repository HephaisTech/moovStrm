const xrouter = require("express").Router();

const BaseRouter = require("../../configs/core/Base_router");
const ctrl = require("./service");

const router = BaseRouter(ctrl, {
  createSchema: ctrl.createSchema,
  readSchema: ctrl.readSchema,
  updateSchema: ctrl.updateSchema,
  modelName: ctrl.modelName,
  moduleName: ctrl.moduleName,
});

xrouter.use(`/${ctrl.moduleName}`, router);

module.exports = xrouter;
