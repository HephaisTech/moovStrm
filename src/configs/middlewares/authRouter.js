const xrouter = require("express").Router();
const ctrl = require("../../modules/users/service");

xrouter.post("/login", ctrl.login);

xrouter.post("/register", ctrl.Signup);

module.exports = xrouter;
