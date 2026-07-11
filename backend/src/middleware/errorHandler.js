function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal Server Error',
    status: statusCode
  };

  if (err.response?.data) {
    response.detail = err.response.data;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;