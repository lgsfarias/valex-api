import { Request, Response, NextFunction } from 'express';
import * as cardServices from '../services/cardsService.js';

const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    throw {
      status: 401,
      message: 'Unauthorized',
    };
  }

  const validApiKey = await cardServices.isValidApiKey(apiKey);

  if (!validApiKey) {
    throw {
      status: 401,
      message: 'Invalid API key',
    };
  }

  res.locals.apiKey = apiKey;

  next();
};

export default verifyApiKey;
