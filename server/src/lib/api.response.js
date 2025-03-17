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
    status: "success",
    message,
  };

  if (data) response.data = data;
  if (metaData) response.metaData = metaData;

  return res.status(statusCode).json(response);
};

export const sendError = (res, error) => {
  // Use the error's statusCode if provided, default to 500 (Server Error)
  const statusCode = error.statusCode || 500;
  const isProduction = config.isProduction;
  console.log("error response data", error);
  // Construct the error response using a similar pattern to sendSuccess
  const response = {
    status: "failed",
    error: {
      type: error.name,
      message: error.message,
      statusCode,
      ...(error.details && { details: error.details }), // Include details if present
      ...(!isProduction && { stack: error.stack }), // Optional: stack trace in dev
    },
  };
  if (isProduction && statusCode >= 500) {
    response.error.message = "Internal server error";
    delete response.error.details;
  }
  return res.status(statusCode).json(response);
};
