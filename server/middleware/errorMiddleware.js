// Error for not found

function notfound(req, res, next) {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
}

// Error  in Routes requests

const errorHanlder = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? res.statusCode:500;
  let message = err.message;

  if (err) {
    statusCode = 404;
    message = "Resource not found";
  }
  res.status(statusCode).json({ message: message, stack: err.stack });
};

module.exports = { notfound, errorHanlder };
