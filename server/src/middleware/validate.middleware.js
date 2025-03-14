// export const validate = (schema) => (req, res, next) => {
//   const result = schema.safeParse(req.body);
//   if (!result.success) {
//     console.log(result.error.errors);
//     return res.status(400).json({ errors: result.error.errors[0].message });
//   }
//   next();

import { ZodError } from "zod";
import { sendError } from "../Lib/api.response.js";
export const validateBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."), // Join path for nested fields
        message: err.message,
      }));

      sendError(res, {
        statusCode: 400,
        message: formattedErrors,
      });
    }
    next(error); // Pass other errors to Express error handler
  }
};
export const validateQuery = (schema) => (req, res, next) => {
  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."), // Join path for nested fields
        message: err.message,
      }));

      sendError(res, {
        statusCode: 400,
        message: formattedErrors,
      });
    }
    next(error); // Pass other errors to Express error handler
  }
};
export const validate = (schema, dataExtractor) => (req, res, next) => {
  try {
    const data = dataExtractor(req);
    schema.parse(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."), // Join path for nested fields
        message: err.message,
      }));

      sendError(res, {
        statusCode: 400,
        message: formattedErrors,
      });
    } else {
      next(error); // Pass other errors to Express error handler
    }
  }
};
