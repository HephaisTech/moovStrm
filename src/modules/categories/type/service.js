const BaseController = require("../../../configs/core/base_services");
const ApiResponse = require("../../../configs/utils/ApiResponse");
const {
  xmodel,
  createSchema,
  readSchema,
  updateSchema,
  moduleName,
} = require("./model");

class Controller extends BaseController {
  constructor() {
    super(xmodel, createSchema, readSchema, updateSchema, moduleName);
  }
}

module.exports = new Controller();
