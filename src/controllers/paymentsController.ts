import { Request, Response } from 'express';
import AppError from '../utils/errors/AppError.js';
import * as rechargesServices from '../services/rechargesService.js';
import * as paymentsService from '../services/paymentsService.js';
import * as cardsService from '../services/cardsService.js';

const makePayment = async (req: Request, res: Response) => {
  const {
    cardId,
    password,
    businessId,
    amount,
  }: {
    cardId: number;
    password: string;
    businessId: number;
    amount: number;
  } = req.body;

  if (!cardId || !password || !businessId || !amount) {
    console.log(req.body);
    throw new AppError('Missing parameters', 400);
  }

  if (amount < 0) {
    throw new AppError('Invalid amount', 400);
  }

  const card = await rechargesServices.verifyIfCardExists(cardId);
  await rechargesServices.verifyIfCardIsActive(card);
  await rechargesServices.verifyIfCardIsExpired(card);
  await rechargesServices.verifyIfCardIsBloqued(card);
  await paymentsService.verifyPassword(password, cardId);
  const business = await paymentsService.verifyIfBusinessExist(businessId);
  paymentsService.verifyIfBusinessIsTheSameType(business, card.type);
  const balance = await cardsService.getBalance(cardId);
  await paymentsService.verifyIfCardHasEnoughBalance(balance, amount);
  await paymentsService.makePayment({ cardId, businessId, amount });

  res.status(200).json({
    message: 'Payment made successfully',
  });
};

export { makePayment };
