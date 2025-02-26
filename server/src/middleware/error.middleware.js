export default function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  console.log("Express Error : ", err.stack);
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
