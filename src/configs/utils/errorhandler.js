"use strict";

const logger = require("./internalAccess");
const ApiResponse = require("./ApiResponse");
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors.map((e) => e.message);
    return ApiResponse.internalServerError(res, messages.join("; "));
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, "Invalid or expired token");
  }
  const statusCode = err.statusCode || 500;
  return ApiResponse.internalServerError(
    res,
    err.message || "Internal Server Error",
  );
};

module.exports = errorHandler;
