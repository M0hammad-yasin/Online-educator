// export default function (err, req, res, next) {
//   const statusCode = err.statusCode || 500;

//   res.status(statusCode).json({
//     error: err.message,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// }
import { sendError } from "../lib/api.response.js";
export default (err, req, res, next) => {
  console.log("Express Error : ", err.stack);

  if (res.headersSent) {
    return next(err);
  }

  // Use our sendError function to send the error response
  sendError(res, err);
};
