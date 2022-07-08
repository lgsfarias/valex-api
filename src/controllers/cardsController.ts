import { Request, Response } from 'express';
import * as cardServices from '../services/cardsService.js';

const createCard = async (req: Request, res: Response) => {
  const { apiKey } = res.locals;
  res.send(apiKey);
};

export { createCard };
