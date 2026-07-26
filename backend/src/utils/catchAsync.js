/**
 * Wraps async route handlers to automatically catch any thrown errors
 * and forward them to the global error handling middleware.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
