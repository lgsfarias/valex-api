import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send('internal server error');
};

export default errorHandler;
