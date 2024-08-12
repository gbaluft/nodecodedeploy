import AppError from "./custom_error_message.js";
import { info, error as _error } from '../../logger/logger.js';

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stack: error.stack,
    // error: error,
  });
  info('dev err', error);
  _error(error);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later",
    });
  }
  _error(error);
};
const castHandleError = (error) => {
  const message = `Invalid value for ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};
const duplicateKeyErrorHandler = (err) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `${field} already exists.`;
  return new AppError(error, code, field);
};

const validationErrorHandler = (err) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  if (errors.length > 1) {
    const formattedErrors = errors.join(", ");
    return new AppError(formattedErrors, code, fields);
  } else {
    return new AppError(errors[0], code, fields);
  }
};


const handleTokenExpiryError = (err) => {
  const message = "Authorization or session expired, Please login again";
  return new AppError(message, 401);
};

const handleNoAuthorizationProvidedError = (err) => {
  const message = "No Authorization provided";
  return new AppError(message, 401, []);
};

const handleJsonWebTokenError = (err) => {
  const message = "Invalid Token";
  return new AppError(message, 401, []);
};
const globalErrorHandler = (error, req, res, next) => {
  console.log('Global Error:', JSON.stringify(error));
  console.log('Handling error:', error.name, error.message);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  _error('Error occurred: ' + JSON.stringify(error));

  if (error.name === "TokenExpiredError") error = handleTokenExpiryError(error);
  if (error.name === "NoAuthorizationProvided")
    error = handleNoAuthorizationProvidedError(error);
  if (error.name === "JsonWebTokenError")
    error = handleJsonWebTokenError(error);

  if (process.env.NODE_ENV === "development") {
    if (error.name === "CastError") error = castHandleError(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    //let err = { ...error, message: error.message };
    if (error.name === "CastError") error = castHandleError(error);
    if (error.code && error.code === 11000)
      error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    prodErrors(res, error);
  }
};

export default globalErrorHandler;

//invalid value id in the end point = castHandleError
//validation error = mongoose validation error
//errors that are not handled by express - handle exceptions
