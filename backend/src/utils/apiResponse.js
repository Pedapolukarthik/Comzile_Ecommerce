const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
};

sendResponse.success = (res, message, data = null, statusCode = 200, meta = null) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

sendResponse.created = (res, message, data = null, meta = null) => {
  return sendResponse(res, 201, true, message, data, meta);
};

sendResponse.error = (res, message, statusCode = 400, data = null) => {
  return sendResponse(res, statusCode, false, message, data);
};

module.exports = sendResponse;
