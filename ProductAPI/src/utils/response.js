function sendSuccess(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data: data
  });
}

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: code,
      message: message
    }
  });
}

module.exports = { sendSuccess, sendError };