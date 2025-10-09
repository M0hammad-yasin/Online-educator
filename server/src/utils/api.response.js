// src/utils/response.js

import config from "../Config/config.js";

/**
 * Standardized success response handler
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {number} options.statusCode - HTTP status code (default: 200)
 * @param {string} options.message - Success message (default: "Operation successful")
 * @param {Object|Array} options.data - Response data
 * @param {Object} options.pagination - Pagination details (optional)
 * @returns {Object} Express response
 */
export const sendSuccess = (res, options = {}) => {
  const {
    statusCode = 200,
    message = "Operation successful",
    data = null,
    pagination,
  } = options;

  const response = {
    success: true,
    message,
    data: Array.isArray(data) ? data : data ?? null,
  };
  if (pagination) response.pagination=pagination;
  return res.status(statusCode).json(response);
};

/**
 * Standardized error response handler
 * @param {Object} res - Express response object
 * @param {Object} error - Error object
 * @returns {Object} Express response
 */
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
    success: false,
    message: errorObj.message,
    data: null,
    error: errorObj
  };

  return res.status(statusCode).json(response);
};
