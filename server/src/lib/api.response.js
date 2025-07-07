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

  let errorObj = {
    type: error.name || "Error",
    message: error.message || "An error occurred",
  };

  // Convert error name to snake_case type
  switch (error.name) {
    case 'ValidationError':
      errorObj.type = "validation_error";
      break;
    case 'AuthenticationError':
      errorObj.type = "authentication_error";
      break;
    case 'AuthorizationError':
      errorObj.type = "authorization_error";
      break;
    case 'ConflictError':
      errorObj.type = "conflict_error";
      break;
    case 'NotFoundError':
      errorObj.type = "not_found_error";
      break;
    case 'BadRequestError':
      errorObj.type = "bad_request_error";
      break;
    case 'ServerError':
    default:
      errorObj.type = "server_error";
      if (isProduction && statusCode >= 500) {
        errorObj.message = "Internal server error. Please try again later.";
      }
      break;
  }

  // Add stack trace in non-production environments
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
