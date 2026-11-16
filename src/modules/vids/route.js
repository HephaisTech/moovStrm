const xrouter = require("express").Router();

const BaseRouter = require("../../configs/core/Base_router");
const {
  checkupload,
  writeFileToDisk,
  gotoUploadView,
} = require("../../configs/middlewares/upload");
const ctrl = require("./service");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = BaseRouter(ctrl, {
  createSchema: ctrl.createSchema,
  readSchema: ctrl.readSchema,
  updateSchema: ctrl.updateSchema,
  modelName: ctrl.modelName,
  moduleName: ctrl.moduleName,
});

router.post(
  `/upload`,
  upload.single("file"),
  checkupload,
  writeFileToDisk,
  ctrl.create,
);
router.get(`/upload`, gotoUploadView);

xrouter.use(`/${ctrl.moduleName}`, router);

module.exports = xrouter;
