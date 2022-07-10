import { Request, Response } from 'express';
import AppError from '../utils/errors/AppError.js';
import { cardsService, rechargesService } from './../services/index.js';

const makeRecharge = async (req: Request, res: Response) => {
  const { cardId, amount } = req.body;

  if (!cardId || !amount) {
    throw new AppError('Missing required fields', 400);
  }

  if (amount < 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardsService.verifyIfCardIsActive(card);
  await cardsService.verifyIfCardIsExpired(card);
  await rechargesService.verifyIfEmployeeWorksForCompany(
    card.employeeId,
    res.locals.company.id,
  );

  await rechargesService.makeRecharge({ cardId, amount });

  res.status(201).json({ message: 'Recharge successful' });
};

export { makeRecharge };
