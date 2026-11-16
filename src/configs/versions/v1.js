const allrouters = require("express").Router();
const v1Router = require("express").Router();
const categoryRouter = require("../../modules/categories/route");
const typeRouter = require("../../modules/categories/type/route");
const partnerRouter = require("../../modules/partners/route");
const contentRouter = require("../../modules/vids/route");
const operatorRouter = require("../../modules/users/route");
// routers subscribe to REST API versioning
allrouters.use(categoryRouter);
allrouters.use(typeRouter);
allrouters.use(partnerRouter);
allrouters.use(contentRouter);
allrouters.use(operatorRouter);

//serving all routers under /api/v1
v1Router.use("/api/v1", allrouters);
module.exports = v1Router;
