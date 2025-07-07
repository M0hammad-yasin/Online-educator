import { sendError } from "../Lib/api.response.js";
export default (err, req, res, next) => {
  console.log("error catch by global error middleware : ",err)
  if (res.headersSent) {
    return next(err);
  }

  sendError(res, err);
};
