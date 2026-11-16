// ApiResponse.js
class ApiResponse {
  // Success responses (2xx)
  static ok(
    res,
    data,
    bodyStatus = 200,
    success = true,
    message = "request successful",
  ) {
    return res.status(200).json({
      type: "result:success",
      success: success ?? true,
      ...(message && { message }),
      status: bodyStatus ?? 200,
      data,
    });
  }

  static created(
    res,
    data,
    bodyStatus = 201,
    success = true,
    message = "created successfully",
  ) {
    return res.status(201).json({
      type: "result:created",
      success: success ?? true,
      ...(message && { message }),
      status: bodyStatus ?? 201,
      data,
    });
  }

  static accepted(
    res,
    data,
    bodyStatus = 200,
    success = true,
    message = "request accepted",
  ) {
    return res.status(202).json({
      type: "result:accepted",
      success: success ?? true,
      ...(message && { message }),
      status: bodyStatus ?? 202,
      data,
    });
  }

  static noContent(
    res,
    data,
    bodyStatus = 204,
    success = false,
    message = "no content",
  ) {
    return res.status(204).json({
      type: "result:no-content",
      success: success ?? false,
      ...(message && { message }),
      status: bodyStatus ?? 204,
      ...(data !== undefined && { data }),
    });
  }

  // Redirection responses (3xx)
  static movedPermanently(
    res,
    location,
    data,
    bodyStatus,
    success = false,
    message,
  ) {
    return res
      .status(301)
      .location(location)
      .json({
        type: "result:redirect",
        success: success ?? false,
        ...(message && { message }),
        status: bodyStatus ?? 301,
        redirectTo: location,
        ...(data !== undefined && { data }),
      });
  }

  static found(res, location, data, bodyStatus, success = false, message) {
    return res
      .status(302)
      .location(location)
      .json({
        type: "result:redirect",
        success: success ?? false,
        ...(message && { message }),
        status: bodyStatus ?? 302,
        redirectTo: location,
        ...(data !== undefined && { data }),
      });
  }

  static seeOther(res, location, data, bodyStatus, success = true, message) {
    return res
      .status(303)
      .location(location)
      .json({
        type: "result:redirect",
        success: success ?? false,
        ...(message && { message }),
        status: bodyStatus ?? 303,
        redirectTo: location,
        ...(data !== undefined && { data }),
      });
  }

  static temporaryRedirect(
    res,
    location,
    data,
    success = true,
    message,
    bodyStatus,
  ) {
    return res
      .status(307)
      .location(location)
      .json({
        type: "result:redirect",
        success: success ?? false,
        ...(message && { message }),
        status: bodyStatus ?? 307,
        redirectTo: location,
        ...(data !== undefined && { data }),
      });
  }

  static permanentRedirect(
    res,
    location,
    data,
    success = true,
    message,
    bodyStatus,
  ) {
    return res
      .status(308)
      .location(location)
      .json({
        type: "result:redirect",
        success: success ?? false,
        ...(message && { message }),
        status: bodyStatus ?? 308,
        redirectTo: location,
        ...(data !== undefined && { data }),
      });
  }

  // Client error responses (4xx)
  static badRequest(res, data, bodyStatus, success = false, message) {
    return res.status(400).json({
      type: "result:error",
      error: true,
      success: success ?? false,
      message: message ?? "BadRequest",
      status: bodyStatus ?? 400,
      ...(data !== undefined && { data }),
    });
  }

  static unauthorized(res, data, bodyStatus, success = false, message) {
    return res.status(401).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Unauthorized",
      status: bodyStatus ?? 401,
      detail,
      ...(data !== undefined && { data }),
    });
  }

  static forbidden(res, data, bodyStatus, success = false) {
    return res.status(403).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Forbidden",
      status: bodyStatus ?? 403,
      detail,
      ...(data !== undefined && { data }),
    });
  }

  static notFound(res, data, bodyStatus, success = false, message) {
    return res.status(404).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "NotFound",
      status: bodyStatus ?? 404,
      ...(data !== undefined && { data }),
    });
  }

  static methodNotAllowed(res, data, bodyStatus, success = false, message) {
    return res.status(405).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Method Not Allowed",
      status: bodyStatus ?? 405,
      ...(data !== undefined && { data }),
    });
  }

  static conflict(res, data, bodyStatus, success = false, message) {
    return res.status(409).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Conflict",
      status: bodyStatus ?? 409,
      ...(data !== undefined && { data }),
    });
  }

  static unprocessableEntity(res, data, bodyStatus, success = false, message) {
    return res.status(422).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Unprocessable Entity",
      status: bodyStatus ?? 422,
      ...(data !== undefined && { data }),
    });
  }

  static tooManyRequests(res, data, bodyStatus, success = false, message) {
    return res.status(429).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Too Many Requests",
      status: bodyStatus ?? 429,
      ...(data !== undefined && { data }),
    });
  }

  // Server error responses (5xx)
  static internalServerError(res, data, bodyStatus, success = false, message) {
    return res.status(500).json({
      type: "result:error",
      error: true,
      success: success ?? false,
      message: message ?? "Internal Server Error",
      status: bodyStatus ?? 500,
      ...(data !== undefined && { data }),
    });
  }

  static notImplemented(res, data, bodyStatus, success = false, message) {
    return res.status(501).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Not Implemented",
      status: bodyStatus ?? 501,
      ...(data !== undefined && { data }),
    });
  }

  static badGateway(res, data, bodyStatus, success = false, message) {
    return res.status(502).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Bad Gateway",
      status: bodyStatus ?? 502,
      ...(data !== undefined && { data }),
    });
  }

  static serviceUnavailable(res, data, bodyStatus, success = false, message) {
    return res.status(503).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Service Unavailable",
      status: bodyStatus ?? 503,
      ...(data !== undefined && { data }),
    });
  }

  static gatewayTimeout(res, data, bodyStatus, success = false, message) {
    return res.status(504).json({
      type: "result:error",
      success: success ?? false,
      message: message ?? "Gateway Timeout",
      status: bodyStatus ?? 504,
      ...(data !== undefined && { data }),
    });
  }

  // Custom response builder
  static custom(
    res,
    httpStatus,
    bodyStatus,
    type,
    detail,
    data,
    message,
    success = true,
  ) {
    const response = {
      type,
      status: bodyStatus,
      success: success ?? false,
    };

    if (message) response.message = message;
    if (detail) response.detail = detail;
    if (data !== undefined) response.data = data;

    // Add error flag for error types
    if (type === "result:error") {
      response.error = true;
    }

    return res.status(httpStatus).json(response);
  }
}

module.exports = ApiResponse;
