// src/utils/response.js

export const sendSuccess = (res, options = {}) => {
  const {
    statusCode = 200,
    message = "Operation successful",
    data = null,
    metadata = null,
  } = options;

  const response = {
    status: "success",
    message,
  };

  if (data) response.data = data;
  if (metadata) response.metadata = metadata;

  return res.status(statusCode).json(response);
};

export const sendError = (res, error) => {
  // Use the error's statusCode if provided, default to 500 (Server Error)
  const statusCode = error.statusCode || 500;
  console.log("error response data", error);
  // Construct the error response using a similar pattern to sendSuccess
  const response = {
    status: "error",
    message: error.message || "An unexpected error occurred",
  };

  return res.status(statusCode).json(response);
};
