// src/utils/response.js

import config from "../Config/config.js";

export const sendSuccess = (res, options = {}) => {
  const {
    statusCode = 200,
    message = "Operation successful",
    data = null,
    metaData = null,
  } = options;

  const response = {
    data,
    error: null,
    isSuccess: true,
    metaData: metaData || null,
  };

  return res.status(statusCode).json(response);
};

export const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const isProduction = config.isProduction;
  console.log("error response data", error);

  let errorObj = {
    type: error.name || "Error",
    message: error.message || "An error occurred",
  };

  switch (error.name) {
    case 'ValidationError':
      errorObj.type = "validation_error";
      if (error.details) errorObj.fields = error.details;
      break;
    case 'AuthenticationError':
      errorObj.type = "authentication_error";
      errorObj.action = "login_required";
      break;
    case 'AuthorizationError':
      errorObj.type = "authorization_error";
      errorObj.action = "check_permissions";
      break;
    case 'ConflictError':
      errorObj.type = "conflict_error";
      if (error.details) errorObj.details = error.details;
      errorObj.action = "resolve_conflict";
      break;
    case 'NotFoundError':
      errorObj.type = "not_found_error";
      errorObj.action = "check_resource_id";
      break;
    case 'BadRequestError':
      errorObj.type = "bad_request_error";
      errorObj.action = "validate_input";
      break;
    case 'ServerError':
    default:
      errorObj.type = "server_error";
      errorObj.action = "retry_later";
      if (isProduction && statusCode >= 500) {
        errorObj.message = "Internal server error. Please try again later.";
      }
      break;
  }

  if (!isProduction && error.stack) {
    errorObj.stack = error.stack;
  }

  const response = {
    data: null,
    error: errorObj,
    isSuccess: false,
    metaData: null,
  };

  return res.status(statusCode).json(response);
};
