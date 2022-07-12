import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/errors/AppError.js';

const verifySchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      throw new AppError(
        error.details.map((err) => err.message).join(', '),
        400,
      );
    }
    next();
  };
};

export default verifySchema;
