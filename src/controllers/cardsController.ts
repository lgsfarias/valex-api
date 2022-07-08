import { Request, Response } from 'express';
import * as cardServices from '../services/cardsService.js';

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  await cardServices.createCard(employeeId, type);

  res.status(201).send('Card created successfully');
};

export { createCard };
