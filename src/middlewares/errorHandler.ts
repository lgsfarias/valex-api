import { ErrorRequestHandler } from 'express';
import AppError from '../utils/errors/AppError.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export default errorHandler;
