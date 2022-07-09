import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/errors/AppError.js';
import * as companiesRepository from '../repositories/companyRepository.js';

const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    throw new AppError('Unauthenticated', 401);
  }

  const validCompany = await companiesRepository.findByApiKey(apiKey);

  if (!validCompany) {
    throw new AppError('Invalid API key', 401);
  }

  res.locals.company = validCompany;

  next();
};

export default verifyApiKey;
