import { sendError } from "../Lib/api.response.js";
export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  sendError(res, err);
};
